#!/usr/bin/env python
# Name: Julien Fer
# Student number: 10649441
#
# This program reads a csv file and convert it to a JSON file.

import csv
import pandas as pd
import json

# global variable for CSV file
INPUT_CSV = "Arbeidsdeelname.csv"

def csv_reader(filename):
    """
    Loads csv file as dataframe and select columns
    to analyze
    """

    data = pd.read_csv(filename, skiprows=4, sep=";")
    # data = data[columns]
    return data


def make_json(data):
    """
    Coverts dataframe to JSON file with date as index
    """
    data.set_index("Perioden").to_json("arbeidsdeelname.json", orient="index")

def remove_string(data, column, string):
    """
    Strips entire column dataframe of string (only rightside)
    """

    data[column] = data[column].map(lambda x: x.rstrip(string))
    return data

if __name__ == "__main__":

    data = csv_reader(INPUT_CSV)
    data = remove_string(data, "Perioden", "(PV)")
    print(data["Perioden"])
    make_json(data)
    # make_json(data)
