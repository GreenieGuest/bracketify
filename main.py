import spotipy
from spotipy.oauth2 import SpotifyOAuth
import streamlit as st
import pandas as pd
import os

CLIENT_ID = 'YOUR_CLIENT_ID_HERE'
CLIENT_SECRET = 'YOUR_CLIENT_SECRET_HERE'
REDIRECT_URI = 'YOUR_REDIRECT_URI_HERE'

sp = spotipy.Spotify(
    auth_manager=SpotifyOAuth(
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        redirect_uri=REDIRECT_URI,
        scope='user-top-read playlist-modify-private user-read-private'
    )
)

def getArtistTopTrack(artist, index):
    results = sp.artist_top_tracks(artist['id'])
    track = results['tracks'][index]

    return track

# Literally just to get the display name so that it looks cool
user_name = sp.current_user()['display_name']

# Set up the streamlit page
st.set_page_config(page_title='Bracketify', page_icon=':musical_note:')
st.title(f'Bracketify for {user_name}')
st.write('64 of the most popular songs from your top 50 artists, seeded by overall popularity.')
st.write('Your top artist gets 4 songs, top 3 get 3 songs, top 10 get 2 songs and the rest of the top 50 only get 1 song.')
st.write('Put all of these matchups in a 64-seeded bracket (I prefer PrintYourBrackets) and enjoy the music until you decide a winner!')

# Get the top 50 artists from your spotify profile, since the max is 50
top_artists = sp.current_user_top_artists(limit=50, time_range='long_term')

# Create a mapping of seed number to track
track_dict = {}
track_index = 1

# Each of the top 50 artists get their most popular song in the bracket
for artist in top_artists['items']:
    t = getArtistTopTrack(artist, 0)
    if t:
        track_dict[track_index] = t
        track_index += 1

# To add up to 64 songs, 10 more songs (second-most) are added from the top 10 artists
for artist in top_artists['items'][:10]:
    t = getArtistTopTrack(artist, 1)
    if t:
        track_dict[track_index] = t
        track_index += 1

# Top 3 artists get their third-most song in the bracket
for artist in top_artists['items'][:3]:
    t = getArtistTopTrack(artist, 2)
    if t:
        track_dict[track_index] = t
        track_index += 1

# Finally, most listened to artist gets their fourth most popular song in the bracket, making 64
top_artist = top_artists['items'][0]
t = getArtistTopTrack(top_artist, 3)
if t:
    track_dict[track_index] = t
    track_index += 1

seeded_tracks = sorted(track_dict.values(), key=lambda t: t['popularity'], reverse=True)

# Define bracket seeding order (expanded for full 64-seed bracket)
bracket_seed_order = [
    1, 64, 32, 33, 17, 48, 16, 49,
    9, 56, 24, 41, 25, 40, 8, 57,
    5, 60, 28, 37, 21, 44, 12, 53,
    13, 52, 20, 45, 4, 61, 29, 36,
    3, 62, 30, 35, 19, 46, 14, 51,
    11, 54, 22, 43, 27, 38, 6, 59,
    7, 58, 26, 39, 23, 42, 10, 55,
    15, 50, 18, 47, 31, 34, 2, 63
]

division = 0 # just something basic to add a divider every 2 songs
# Display tracks in bracket seed order
for seed in bracket_seed_order:
    division += 1
    track = seeded_tracks[seed - 1]
    track_name = track['name']
    artists = ', '.join([artist['name'] for artist in track['artists']])
    album_image = track['album']['images'][0]['url']  # Largest image

    col1, col2 = st.columns([1, 16])
    with col1:
        st.image(album_image, width=36)
    with col2:
        st.markdown(f"**{seed} |** *{artists} - {track_name}*")
    if division == 2:
        st.markdown("<hr style='margin: 0.1em 0; border: 0.25px solid #555;'>", unsafe_allow_html=True)
        division = 0
        
# Lastly create a button that allows this to be saved into a playlist        
bracketed_tracks = [seeded_tracks[seed - 1] for seed in bracket_seed_order]
track_uris = [track['uri'] for track in bracketed_tracks]
if st.button("Create Bracketify Playlist"):
    user_id = sp.current_user()['id']
    playlist = sp.user_playlist_create(
        user=user_id,
        name=f"Bracketify for {user_name}",
        public=False,
        description="64 of the most popular songs from your top 50 artists, seeded by popularity."
    )
    
    playlist_id = playlist['id']
    sp.playlist_add_items(playlist_id, track_uris)
    st.success("Playlist created! NOTE: Seed #s won't match up with the custom #s in the playlist. Just use the bracket as guidance.")
