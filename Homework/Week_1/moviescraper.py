#!/usr/bin/env python
# Name: Julien Fer
# Student number: 10649441
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # creates list(movies) to store the iformation per movie
    movies = []

    # iterate over evry content on IMDB page and find the necessary information
    for content in dom.find_all(attrs={"class": "lister-item-content"}):

        # creates dictionary (information) to add the information per movie
        information = {}

        # find lister-item-header and collect title as text
        header = content.find(attrs={"class": "lister-item-header"})
        title = header.find('a')
        title = title.get_text()

        # find lister-item-year and collect year as text
        year = header.find(attrs={"class": "lister-item-year text-muted unbold"})
        year = year.get_text()
        year = ''.join(filter(lambda x: x.isdigit(), year))

        # find class=strong and collect rating as text
        rating = content.find("strong")
        rating = rating.get_text()

        # find paragraphs and collect actors as list
        paragraph = content.find('p')
        paragraph = paragraph.find_next_sibling('p')
        paragraph = paragraph.find_next_sibling('p')
        actors_movie = paragraph.find_all('a')
        actors = []

        for actor in actors_movie:
            actor = actor.get_text()
            actors.append(actor)
        # coverts actors (list) to string
        actors = ",".join(actors)

        # find class=runtime and collect runtime as text
        runtime = content.find(attrs={"class": "runtime"})
        runtime = runtime.get_text()

        # add all the information to dictionary (information)
        information["title"] = title
        information["year"] = year
        information["rating"] = rating
        information["actors"] = actors
        information["runtime"] = runtime

        # append the information to the list movies
        movies.append(information)

    # returns list (movies)
    return movies


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])

    # iterate over every movie, collect info and write to CSV file
    for movie in movies:
        title = movie["title"]
        rating = movie["rating"]
        year = movie["year"]
        actors = movie["actors"]
        runtime = movie["runtime"]
        writer.writerow([title, rating, year, actors, runtime])


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')
    # print(dom.prettify())

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
