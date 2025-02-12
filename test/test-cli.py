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
    """Run a CLI command and capture the output."""
    try:
        result = subprocess.run(command, shell=True, cwd=CLI_DIR, capture_output=True, text=True)
        return result.stdout.strip(), result.stderr.strip()
    except Exception as e:
        return "", str(e)


def save_response(filename, output):
    """Save the CLI output to a JSON file."""
    data = {"output": output} if output else {"error": "No output or command failed"}
    file_path = os.path.join(RESPONSE_DIR, f"{filename}.json")
    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4, ensure_ascii=False)
    print(f"Response saved as JSON to {file_path}")


def compare_responses(filename):
    """Compare the saved response with the success reference file."""
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


def execute_and_compare(command, filename):
    """Execute a command and save/compare its output."""
    output, error = run_command(command)
    save_response(filename, output or error)
    compare_responses(filename)


def login():
    """Login to the system via CLI and compare the response."""
    output, error = run_command("se2420 login --username admin1 --passw securepass123")
    save_response("login_response", output or error)
    compare_responses("login_response")
    return "Login successful" in (output or error)


def logout():
    """Logout from the system via CLI."""
    output, error = run_command("se2420 logout")
    save_response("logout_response", output or error)
    compare_responses("logout_response")


def reset_stations():
    """Reset stations via the CLI."""
    output, error = run_command("se2420 resetstations")
    save_response("reset_stations_response", output or error)
    compare_responses("reset_stations_response")


def reset_passes():
    """Reset passes via the CLI."""
    output, error = run_command("se2420 resetpasses")
    save_response("reset_passes_response", output or error)
    compare_responses("reset_passes_response")


def get_diagram1(operator, start_date, end_date):
    """Get diagram 1 data."""
    command = f"se2420 diagram1 --operator {operator} --from {start_date} --to {end_date} --format json"
    execute_and_compare(command, "diagram1_response")


def get_diagram2(start_date, end_date):
    """Get diagram 2 data."""
    command = f"se2420 diagram2 --from {start_date} --to {end_date} --format json"
    execute_and_compare(command, "diagram2_response")


def get_pass_analysis(station_op_id, tag_op_id, date_from, date_to):
    """Get pass analysis data."""
    command = f"se2420 passanalysis --stationop {station_op_id} --tag {tag_op_id} --from {date_from} --to {date_to} --format json"
    execute_and_compare(command, "pass_analysis_response")


def get_passes_cost(toll_op_id, tag_op_id, date_from, date_to):
    """Get passes cost data."""
    command = f"se2420 passescost --stationop {toll_op_id} --tag {tag_op_id} --from {date_from} --to {date_to} --format json"
    execute_and_compare(command, "passes_cost_response")


def get_charges_by(toll_op_id, date_from, date_to):
    """Get charges by data."""
    command = f"se2420 chargesby --opid {toll_op_id} --from {date_from} --to {date_to} --format json"
    execute_and_compare(command, "charges_by_response")


def test_endpoints():
    """Test the healthcheck endpoint."""
    command = "se2420 healthcheck"
    execute_and_compare(command, "healthcheck")


if __name__ == "__main__":
    if login():
        reset_stations()
        reset_passes()
        test_endpoints()
        get_diagram1("aegeanmotorway", "2022-01-01", "2022-03-01")
        get_diagram2("2022-01-01", "2022-02-01")
        get_passes_cost("NAO", "NAO", "20220101", "20230110")
        get_pass_analysis("NAO30", "NAO", "2022-01-01", "2023-01-10")
        get_charges_by("NAO", "2022-01-01", "2023-01-10")
        logout()
    else:
        print(Fore.RED + "Login failed. Skipping tests.")
