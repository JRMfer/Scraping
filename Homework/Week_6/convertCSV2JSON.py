#!/usr/bin/env python
# Name: Julien Fer
# Student number: 10649441
#
# This program reads a csv file and converts it to a JSON file.

import csv
import pandas as pd
import json

# global variable for CSV file
INPUT_CSV = "Government_spending_2014.csv"

def csv_reader(filename):
    """
    Loads csv file as dataframe and select columns
    to analyze
    """

    data = pd.read_csv(filename)
    return data

def preprocessing(data, columns_drop, index):
    """
    Preprocces dataframe as necessary
    to convert the data to a JSON file
    """

    data = data.drop(columns=columns_drop)
    data = data.set_index(index)
    data = data.unstack()
    data.columns = data.columns.droplevel()
    return data

def make_json(data):
    """
    Coverts dataframe to JSON file with index as key
    """
    data.to_json("Government_spending_2014.json", orient="index")


if __name__ == "__main__":

    data = csv_reader(INPUT_CSV)
    data = preprocessing(data, ["INDICATOR", "MEASURE", "FREQUENCY", "TIME", "Flag Codes"], ["LOCATION", "SUBJECT"])
    make_json(data)
