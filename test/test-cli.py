import subprocess
import json
import os
from colorama import Fore, init

# Initialize colorama for cross-platform compatibility (Windows and Unix-like systems)
init(autoreset=True)

CLI_DIR = "../cli-client"  # Directory where the CLI client is located
RESPONSE_DIR = "./response-cli"
SUCCESS_DIR = "./success-cli"
os.makedirs(RESPONSE_DIR, exist_ok=True)


def run_command(command):
    """
    Run a CLI command and capture the output.
    """
    try:
        result = subprocess.run(command, shell=True, cwd=CLI_DIR, capture_output=True, text=True)
        return result.stdout.strip(), result.stderr.strip()
    except Exception as e:
        return "", str(e)


def save_response(filename, output):
    """
    Save the CLI output to a JSON file in the response directory.
    """
    data = {"output": output} if output else {"error": "No output or command failed"}

    with open(f"{RESPONSE_DIR}/{filename}.json", "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4, ensure_ascii=False)
    print(f"Response saved as JSON to {RESPONSE_DIR}/{filename}.json")


def compare_responses(filename):
    """
    Compare the saved response with the success reference file in the success directory.
    """
    try:
        with open(f"{RESPONSE_DIR}/{filename}.json", "r", encoding="utf-8") as response_file:
            response_data = json.load(response_file)

        with open(f"{SUCCESS_DIR}/{filename}.json", "r", encoding="utf-8") as success_file:
            success_data = json.load(success_file)

        if response_data == success_data:
            print(f"{filename} - {Fore.GREEN}Success")
        else:
            print(f"{filename} - {Fore.RED}Failure")
    except FileNotFoundError:
        print(f"{filename} - {Fore.RED}Failure (Missing reference file in '{SUCCESS_DIR}/')")
    except json.JSONDecodeError:
        print(f"{filename} - {Fore.RED}Failure (Error decoding JSON)")


def login():
    output, error = run_command("se2420 login --username admin1 --passw securepass123")
    save_response("login_response", output or error)
    compare_responses("login_response")
    return "Login successful" in output


def logout():
    output, error = run_command("se2420 logout")
    save_response("logout_response", output or error)
    compare_responses("logout_response")


def reset_stations():
    output, error = run_command("se2420 resetstations")
    save_response("reset_stations_response", output or error)
    compare_responses("reset_stations_response")


def reset_passes():
    output, error = run_command("se2420 resetpasses")
    save_response("reset_passes_response", output or error)
    compare_responses("reset_passes_response")


def test_endpoints():
    commands = [
       # ("toll_station_passes", "se2420 tollstationpasses --station NAO30 --from 20220101 --to 20220201 --format json"),
        ("healthcheck", "se2420 healthcheck")
    ]

    for filename, command in commands:
        output, error = run_command(command)
        save_response(filename, output or error)
        compare_responses(filename)


if __name__ == "__main__":
    if login():
        reset_stations()
        reset_passes()
        test_endpoints()
        logout()
    else:
        print(Fore.RED + "Login failed. Skipping tests.")
