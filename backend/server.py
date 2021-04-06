import hug
import podcastparser
import urllib
from tinydb import TinyDB, Query

db = TinyDB('podcasts.json')

@hug.get('/podcast')
def fetch_podcast(feedurl: hug.types.text):
    parsed = podcastparser.parse(feedurl, urllib.request.urlopen(feedurl))
    return parsed

@hug.get('/save') # TODO: convert to POST
def save_podcast(feedurl: hug.types.text, title: hug.types.text):
    Podcast = Query()
    if not db.search(Podcast.url == feedurl):
        db.insert({'title': title, 'url': feedurl})
    
    return db.all()


@hug.get('/saved')
def saved_podcasts():
    return db.all()