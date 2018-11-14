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
import json

# global variable for CSV file
INPUT_CSV = "input.csv"


def csv_reader(filename):
    data = pd.read_csv(filename)
    data = data[["Country", "Region", "GDP ($ per capita) dollars",
                 "Pop. Density (per sq. mi.)", "Infant mortality (per 1000 births)"]]
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
    data[column] = [x.replace(',', '.') for x in data[column]]
    return data


def rem_white(data, column):
    data[column] = [x.rstrip() for x in data[column]]
    return data


def preprocessing(data):
    data = remove_string(
        data, "GDP ($ per capita) dollars", "dollars")
    data = string_to_numeric(data, "GDP ($ per capita) dollars")
    data = make_float(data, "Pop. Density (per sq. mi.)")
    data = make_float(data, "Infant mortality (per 1000 births)")
    data = string_to_numeric(data, "Pop. Density (per sq. mi.)")
    data = string_to_numeric(
        data, "Infant mortality (per 1000 births)")
    data = rem_white(data, "Region")
    data = data[["Country", "Region", "GDP ($ per capita) dollars",
                 "Pop. Density (per sq. mi.)",
                 "Infant mortality (per 1000 births)"]]
    return data


def central_tendency(data, column, xlabel):
    data = remove_outliers(data, column)
    data.hist(column)
    plt.title(column, fontsize=16)
    plt.xlabel(xlabel, fontsize=14)
    plt.ylabel("Frequency", fontsize=14)
    plt.show()
    return

def remove_outliers(data, column):
    mean = data[column].mean()
    median = data[column].median()
    mode = data[column].mode()
    std = data[column].std()
    data[column] = data[column].mask(data[column] > mean + 3 * std)
    data = data.dropna(how='any')
    return data

def boxplot(data, column):
    data.boxplot(column, grid=False)
    data.boxplot(column, by="Region", rot=90, grid=False)
    plt.show()
    return

def make_json(data):
    data.set_index("Country").to_json("eda.json", orient="index")
    return


if __name__ == "__main__":
    data_frame = csv_reader(INPUT_CSV)
    data_frame = preprocessing(data_frame)
    central_tendency(data_frame, "GDP ($ per capita) dollars", "Dollars")
    data_frame = remove_outliers(data_frame, "Infant mortality (per 1000 births)")
    boxplot(data_frame, "Infant mortality (per 1000 births)")
    make_json(data_frame)
