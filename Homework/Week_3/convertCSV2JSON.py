#!/usr/bin/env python
# Name: Julien Fer
# Student number: 10649441
#
# This program reads a csv file and convert it to a JSON file.

import csv
import pandas as pd
import json

# global variable for CSV file
INPUT_CSV = "unemployment.csv"

def csv_reader(filename, columns):
    """
    Loads csv file as dataframe and select columns
    to analyze
    """

    data = pd.read_csv(filename)
    data = data[columns]
    return data


def make_json(data):
    """
    Coverts dataframe to JSON file with date as index
    """
    data.set_index("DATE").to_json("data.json", orient="index")


if __name__ == "__main__":

    data = csv_reader(INPUT_CSV, ["DATE", "UNEMPLOYMENT"])
    make_json(data)
