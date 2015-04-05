from sqlalchemy import Column, String, Boolean, ForeignKey, Integer
from sqlalchemy.orm import relationship
from database import Base
from string import ascii_letters
from random import choice


class Playlist(Base):
    __tablename__ = "playlists"
    id = Column(String, primary_key=True)
    name = Column(String)

    def __init__(self, name):
        generate = True
        while generate:
            random_string = "".join(choice(ascii_letters) for i in range(5))

            p = Playlist.query.get(random_string)
            # Only set value and exit loop if the id is not already in use
            if p == None:
                generate = False
        
        self.id = random_string
        self.name = name

    @staticmethod
    def get_videos(playlist_id):
        videos = Video.query.filter(Video.playlist_id==playlist_id).order_by("rank desc")

        playlist = []
        for video in videos:
            playlist_entry = {
                "playlist_id": playlist_id,
                "slug": video.slug,
                "thumbnail_url": video.thumbnail_url,
                "title": video.title,
                "rank": video.rank
            }

            playlist.append(playlist_entry)

        return playlist

    def __repr__():
        return "<Playlist ID:{0}, Name:{1}>".format(self.id, self.name)


class Video(Base):
    __tablename__ = "video"
    id = Column(Integer, primary_key=True)
    playlist_id = Column(String, ForeignKey(Playlist.id))
    playlist = relationship("Playlist")
    slug = Column(String)
    thumbnail_url = Column(String)
    title = Column(String)
    rank = Column(Integer)

    def __init__(self, playlist_id, slug, thumbnail_url, title):
        self.playlist_id = playlist_id
        self.slug = slug
        self.thumbnail_url = thumbnail_url
        self.title = title
        self.rank = 0
