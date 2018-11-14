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


def csv_reader(filename, columns):
    """
    Loads csv file as dataframe and select columns
    to analyze
    """

    data = pd.read_csv(filename)
    data = data[columns]
    return data


def remove_string(data, column, string):
    """
    Strips entire column dataframe of string (only rightside)
    """

    data[column] = data[column].map(lambda x: x.rstrip(string))
    return data


def string_to_numeric(data, column):
    """
    Convert all strings in column to numeric
    """
    data[column] = pd.to_numeric(data[column])
    return data


def make_float(data, column):
    """
    Convert all decimals with commas in column
    to decimals with dots and finally to a float
    """
    data[column] = [x.replace(',', '.') for x in data[column]]
    data = string_to_numeric(data, column)
    return data


def preprocessing(data):
    """
    Removes incomplete observations and
    makes all values in columns usable
    """

    data = data.replace("unknown", np.nan)
    data = data.dropna(how='any')
    data = remove_string(
                         data, "GDP ($ per capita) dollars", "dollars")
    data = string_to_numeric(data, "GDP ($ per capita) dollars")
    data = make_float(data, "Pop. Density (per sq. mi.)")
    data = make_float(data, "Infant mortality (per 1000 births)")
    data = remove_string(data, "Region", " ")
    return data


def central_tendency(data, column, xlabel, ylabel):
    """
    Calculates mean, median, mode and standard deviation.
    Also plots a histogram with outliers and without outliers
    """

    mean = data[column].mean()
    median = data[column].median()
    mode = data[column].mode()
    std = data[column].std()
    plot_hist(data, column, xlabel, ylabel)
    data = remove_outliers(data, column)
    plot_hist(data, column, xlabel, ylabel)

def plot_hist(data, column, xlabel, ylabel):
    """
    Plots a histogram (with xlabel and ylabel given by user)
    of specific column of dataframe
    """
    plt.style.use("seaborn-darkgrid")
    data.hist(column, bins=50, color="green")
    plt.title(column, fontsize=16)
    plt.xlabel(xlabel, fontsize=14)
    plt.ylabel(ylabel, fontsize=14)
    plt.show()

def remove_outliers(data, column):
    """
    Removes outliers of a specific column of dataframe
    """
    data[column] = data[column].mask(data[column] > data[column].mean() + 3 * data[column].std())
    data = data.dropna(how='any')
    return data

def boxplot(data, column):
    """
    Makes one boxplot with all observations of a column in dataframe
    and one ordered by region
    """
    data.boxplot(column, grid=False)
    data.boxplot(column, by="Region", rot=90, grid=False)
    plt.show()

def make_json(data):
    """
    Coverts dataframe to JSON file with as index the names of the country
    """
    data.set_index("Country").to_json("eda.json", orient="index")


if __name__ == "__main__":

    # reads certain columns of CSV file
    data_frame = csv_reader(INPUT_CSV, ["Country", "Region",
                                        "GDP ($ per capita) dollars",
                                        "Pop. Density (per sq. mi.)",
                                        "Infant mortality (per 1000 births)"])

    # preprocces dataframe
    data_frame = preprocessing(data_frame)

    # central tendency for GDP
    central_tendency(data_frame, "GDP ($ per capita) dollars", "Dollars",
                     "Frequency")

    # boxplots of infant mortality
    boxplot(data_frame, "Infant mortality (per 1000 births)")

    # convert dataframe to JSON file
    make_json(data_frame)
