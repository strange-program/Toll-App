import requests
import json
import os
from colorama import Fore, init

# Initialize colorama for cross-platform compatibility (Windows and Unix-like systems)
init(autoreset=True)

BASE_URL = "http://localhost:9115"  # Change to actual API base URL
ADMIN_CREDENTIALS = {"username": "admin1", "password": "securepass123"}

session = requests.Session()

# Ensure the ./response/ directory exists
os.makedirs("./response", exist_ok=True)

def save_response(filename, response):
    """
    Save the response to a JSON file in the ./response/ directory.
    """
    data = response.json() if response.ok else {"error": response.status_code, "message": response.text}

    with open(f"./response/{filename}.json", "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4, ensure_ascii=False)
    print(f"Response saved as JSON to ./response/{filename}.json")

def clean_response(response_data):
    """
    Remove fields like 'timestamp', 'requestTimestamp', 'passID', and '_id' from the response data.
    """
    if isinstance(response_data, dict):
        keys_to_remove = [key for key in response_data if
                          "timestamp" in key.lower() or
                          "passID" in key.lower() or
                          "requestTimestamp" in key.lower() or
                          "_id" in key.lower()]
        for key in keys_to_remove:
            del response_data[key]
        return response_data
    elif isinstance(response_data, list):
        # Clean each item in the list (if it's a dictionary)
        cleaned_list = [clean_response(item) if isinstance(item, dict) else item for item in response_data]
        return cleaned_list
    return response_data

def compare_responses(filename):
    """
    Compare the saved response with the success reference file in the './success/' directory.
    """
    try:
        # Read the saved response and the success reference file
        with open(f"./response/{filename}.json", "r", encoding="utf-8") as response_file:
            response_data = json.load(response_file)

        with open(f"./success/{filename}.json", "r", encoding="utf-8") as success_file:
            success_data = json.load(success_file)

        # Clean the response data (remove dynamic fields like timestamps, passID, _id)
        cleaned_response_data = clean_response(response_data)
        cleaned_success_data = clean_response(success_data)

        # Compare the cleaned response contents
        if cleaned_response_data == cleaned_success_data:
            print(f"{filename} - {Fore.GREEN}Success")
        else:
            print(f"{filename} - {Fore.RED}Failure")
    except FileNotFoundError:
        print(f"{filename} - {Fore.RED}Failure (Missing reference file in './success/')")
    except json.JSONDecodeError:
        print(f"{filename} - {Fore.RED}Failure (Error decoding JSON)")

def login():
    response = requests.post(f"{BASE_URL}/api/login", json=ADMIN_CREDENTIALS)
    save_response("login_response", response)
    if response.ok:
        session.headers.update({"X-OBSERVATORY-AUTH": response.json().get('token', '')})

def logout():
    response = session.post(f"{BASE_URL}/api/logout")
    save_response("logout_response", response)
    compare_responses("logout_response")

def reset_stations():
    response = session.post(f"{BASE_URL}/api/admin/resetstations")
    save_response("reset_stations_response", response)
    compare_responses("reset_stations_response")

def reset_passes():
    response = session.post(f"{BASE_URL}/api/admin/resetpasses")
    save_response("reset_passes_response", response)
    compare_responses("reset_passes_response")

def get_diagram1(operator, start_date, end_date):
    params = {"operator": operator, "startDate": start_date, "endDate": end_date}
    response = session.get(f"{BASE_URL}/api/getDiagram1", params=params)
    save_response("diagram1_response", response)
    compare_responses("diagram1_response")

def get_diagram2(start_date, end_date):
    params = {"startDate": start_date, "endDate": end_date}
    response = session.get(f"{BASE_URL}/api/getDiagram2", params=params)
    save_response("diagram2_response", response)
    compare_responses("diagram2_response")

def get_toll_map_passes(station_id, start_date, end_date):
    params = {"stationId": station_id, "startDate": start_date, "endDate": end_date}
    response = session.get(f"{BASE_URL}/api/passes", params=params)
    save_response("toll_map_passes_response", response)
    compare_responses("toll_map_passes_response")

def test_endpoints():
    endpoints = [
        ("toll_stations", "/api/tollStations"),
        ("toll_station_passes", "/api/tollStationPasses")
    ]

    admin_endpoints = [
        ("healthcheck", "/api/admin/healthcheck")
    ]

    for filename, endpoint in endpoints + admin_endpoints:
        response = session.get(f"{BASE_URL}{endpoint}") if "admin" not in filename else session.post(f"{BASE_URL}{endpoint}")
        save_response(filename, response)
        compare_responses(filename)

def get_toll_station_passes(toll_station_id, date_from, date_to):
    response = session.get(f"{BASE_URL}/api/tollStationPasses/{toll_station_id}/{date_from}/{date_to}")
    save_response("toll_station_passes_response", response)
    if response.ok:
        try:
            response_data = response.json()  # Try decoding the response
        except json.JSONDecodeError:
            print(f"Failed to decode JSON for toll_station_passes_response: {response.text}")
            return
    compare_responses("toll_station_passes_response")

def get_pass_analysis(station_op_id, tag_op_id, date_from, date_to):
    response = session.get(f"{BASE_URL}/api/passAnalysis/{station_op_id}/{tag_op_id}/{date_from}/{date_to}")
    save_response("pass_analysis_response", response)
    if response.ok:
        try:
            response_data = response.json()  # Try decoding the response
        except json.JSONDecodeError:
            print(f"Failed to decode JSON for pass_analysis_response: {response.text}")
            return
    compare_responses("pass_analysis_response")

def get_passes_cost(toll_op_id, tag_op_id, date_from, date_to):
    response = session.get(f"{BASE_URL}/api/passesCost/{toll_op_id}/{tag_op_id}/{date_from}/{date_to}")
    save_response("passes_cost_response", response)
    if response.ok:
        try:
            response_data = response.json()  # Try decoding the response
        except json.JSONDecodeError:
            print(f"Failed to decode JSON for passes_cost_response: {response.text}")
            return
    compare_responses("passes_cost_response")

def get_charges_by(toll_op_id, date_from, date_to):
    response = session.get(f"{BASE_URL}/api/chargesBy/{toll_op_id}/{date_from}/{date_to}")
    save_response("charges_by_response", response)
    if response.ok:
        try:
            response_data = response.json()  # Try decoding the response
        except json.JSONDecodeError:
            print(f"Failed to decode JSON for charges_by_response: {response.text}")
            return
    compare_responses("charges_by_response")

def test_endpoints():
    endpoints = [
        ("toll_stations", "/api/tollStations"),
        ("toll_station_passes", "/api/tollStationPasses")
    ]

    admin_endpoints = [
        ("healthcheck", "/api/admin/healthcheck")
    ]

    for filename, endpoint in endpoints + admin_endpoints:
        response = session.get(f"{BASE_URL}{endpoint}") if "admin" not in filename else session.post(f"{BASE_URL}{endpoint}")
        save_response(filename, response)
        compare_responses(filename)

if __name__ == "__main__":
    login()
    reset_stations()
    reset_passes()
    test_endpoints()
    get_diagram1("aegeanmotorway", "2022-01-01", "2022-03-01")
    get_diagram2("2022-01-01", "2022-02-01")
    get_passes_cost("NAO","NAO","20220101","20230110")
    get_toll_map_passes("NAO30", "2022-01-01", "2022-02-01")
    get_toll_station_passes("NAO30","2022-01-01","2023-01-10")
    get_pass_analysis("NAO30","NAO","2022-01-01","2023-01-10")
    get_charges_by("NAO","2022-01-01","2023-01-10")
    logout()
