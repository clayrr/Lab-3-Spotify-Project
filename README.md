Description: 
This project is inspired by Spotify Wrapped, and it presents personalized and interactive music insights with unique and creative features.  This includes the bubble tea recommendation, the season the user represents, and the energy level of the user. 

For the user interface, we’ll design:
- A Dashboard to display the user’s account data and insights.
- Visuals/Illustrations (charts and graphs) for an aesthetic presentation of the data such as “Receiptify," which displays data in the form of a shopping receipt

For the back end, we will analyze the user's top songs and music preferences to determine their attributes (such as bubble tea recommendation, season, or energy level) and store this data. 
Before settling on this idea, we also considered making a blog or a “how cooked are you for your HM” test calculator. 

Endpoints completed: 
1. /season - Using the user’s top song, we will determine the season the user embodies by looking at the danceability of the song (value provided by Spotify). 
Winter (danceability < 0.25): Calm and introspective
Autumn (0.25 ≤ danceability < 0.5): Mellow and reflective
Spring (0.5 ≤ danceability < 0.75): Fresh and lively
Summer (danceability ≥ 0.75): Vibrant and energetic

2. /bubbletea - based on the popularity of the top 10 artists the user listened to, we will suggest a bubble tea order. Each artist has a popularity score (value provided by Spotify).  The average popularity score of the 10 artists will allow us to determine a boba tea flavor from one of four categories: least basic, slightly basic, more basic, or most basic. The result is a randomly selected tea from the appropriate category.
   
3. /energyLevel - Using the user’s top song, we will determine the energy level of the user by looking at the energy of the song (value provided by Spotify). 
Low energy (danceability < 0.25) 
Moderately low energy (0.25 ≤ danceability < 0.5)
Moderate energy (0.5 ≤ danceability < 0.75) 
High energy (danceability ≥ 0.75)

Endpoints needed: 
- GET the user’s top 10 songs from Spotify 
- GET the user’s top song from Spotify 
- GET the danceability of the user’s top song from Spotify 
- GET the energy of the user’s top song from Spotify 

