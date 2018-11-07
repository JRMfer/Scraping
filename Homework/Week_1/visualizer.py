#!/usr/bin/env python
# Name: Julien Fer
# Student number: 10649441
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt
from matplotlib.ticker import FormatStrFormatter

# global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

# Reads csv file and maps the information in an OrderedDict
def csv_reader(file):
    """
    This function collects the ratings per year (IMDB) from a csv file
    and returns the average per year as a dictionary.
     """

    # opens file and creates a reader for csv file
    with open(file) as csvfile:
        reader = csv.DictReader(csvfile)

        # reads every row and collects the ratings per year
        for row in reader:
            rating = float(row["Rating"])
            data_dict[row["Year"]].append(rating)

        # calculates the average rating per year
        for key in range(START_YEAR, END_YEAR):
            ratings = data_dict[str(key)]
            length = len(ratings)
            total = sum(ratings)
            average = total / length
            data_dict[str(key)] = average

    # returns dictionary with averages per year
    return data_dict

# plot the averages of the ratings per year:
def plot_ratings(dict):
    """
    This function gets a dictionary and plots the values (averges ratings)
    in the dictionary against their keys (year)
    """
    # creates lists to store values for year and averages
    year = []
    average= []

    # append year and averegas to the lists
    for key in range(START_YEAR, END_YEAR):
        year.append(key)
        average.append(dict[str(key)])

    # plots the average ratings against the years twice (with different y limits)
    fig, ax = plt.subplots()
    plt.xlabel("Year", fontsize=14, color='black')
    plt.xticks(year)
    ax.yaxis.set_major_formatter(FormatStrFormatter('%.2f'))
    plt.ylabel("Rating", fontsize=14, color='black')
    plt.title("Average Movie Rating (IMDB) Per Year\n", fontsize=16, color='black')
    plt.grid()
    plt.axis([START_YEAR, END_YEAR, 0, 10])
    plt.plot(year, average, color='blue', linestyle='solid')

    plt.figure(2)
    plt.xlabel("Year", fontsize=14, color='black')
    plt.xticks(year)
    ax.yaxis.set_major_formatter(FormatStrFormatter('%.2f'))
    plt.ylabel("Rating", fontsize=14, color='black')
    plt.title("Average Movie Rating (IMDB) Per Year\n", fontsize=16, color='black')
    plt.grid()
    plt.axis([START_YEAR, END_YEAR, min(average) - 0.5, 10])
    plt.plot(year, average, color='blue', linestyle='solid')
    plt.show()
    return

if __name__ == "__main__":
    ratings_movies = csv_reader(INPUT_CSV)
    plot_ratings(ratings_movies)
