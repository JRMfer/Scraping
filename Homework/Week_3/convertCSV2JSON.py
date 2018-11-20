#!/usr/bin/env python
# Name: Julien Fer
# Student number: 10649441

import csv
import pandas as pd
import os
import json

# global variable for CSV file
INPUT_CSV1 = "unemployment.csv"
INPUT_CSV2 = "cpi.csv"

def csv_reader(filename, columns):
    """
    Loads csv file as dataframe and select columns
    to analyze
    """

    data = pd.read_csv(filename)
    data = data[columns]
    return data

def merge_dataframe(file1, file2, id, how):
    merged = file1.merge(file2, on=id, how=how)
    merged.to_csv("data.csv", index=False)
    return merged

def make_json(data):
    """
    Coverts dataframe to JSON file with as date as index
    """
    data.set_index("DATE").to_json("data.json", orient="index")


if __name__ == "__main__":

    data1 = csv_reader(INPUT_CSV1, ["DATE", "UNEMPLOYMENT"])
    print(data1)
    data2 = csv_reader(INPUT_CSV2, ["DATE", "CPI" ])
    print(data2)
    data3 = merge_dataframe(data1, data2, "DATE", "outer")
    print(data3[["CPI"][0]])
    make_json(data3)
