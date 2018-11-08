#!/usr/bin/env python
# Name: Julien Fer
# Student number: 10649441
"""
This script analyzes data of some countries, EDA
"""

import csv
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np

# global variable for CSV file
INPUT_CSV = "input.csv"


def csv_reader(filename):
    data = pd.read_csv(filename)
    # data = data[np.isfinite(data['EPS'])]
    data = data.replace("unknown", np.nan)
    data = data.dropna(how='any')
    return data

# je wilt over elke rij itereren en kijken of de rij NaN bevat. Zo ja, verwijder
# de rij van de data frame aangezien deze niet van nut kan zijn


def remove_string(data_frame, column, string):
    data_frame[column] = data_frame[column].map(lambda x: x.rstrip(string))
    return data_frame


def string_to_numeric(data, column):
    data[column] = pd.to_numeric(data[column])
    return data

def make_float(data, column):
    ## DEZE MOET NOG AANGEPAST WORDEN
    return


if __name__ == "__main__":
    data_frame = csv_reader(INPUT_CSV)
    data_frame = remove_string(data_frame, "GDP ($ per capita) dollars", "dollars")
    data_frame = string_to_numeric(data_frame, "GDP ($ per capita) dollars")
    data_frame = string_to_numeric(data_frame, "Population")
    data_frame = string_to_numeric(data_frame, "Pop. Density (per sq. mi.)")
    data_frame = string_to_numeric(data_frame, "Infant mortality (per 1000 births)")
    print(data_frame)
    print(data_frame["GDP ($ per capita) dollars"])
    test = data_frame["GDP ($ per capita) dollars"][0] + \
        data_frame["GDP ($ per capita) dollars"][1]
    print(test)
    print(data_frame["Pop. Density (per sq. mi.)"])
