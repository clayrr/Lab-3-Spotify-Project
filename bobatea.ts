import express, { Request, Response } from 'express';

const app = express();
const port = 8888;

//  artist data; simulated numbers
const artists = [
    { name: "Artist 1", popularity: 15 },
    { name: "Artist 2", popularity: 34 },
    { name: "Artist 3", popularity: 51 },
    { name: "Artist 4", popularity: 73 },
    { name: "Artist 5", popularity: 6 },
    { name: "Artist 6", popularity: 101 },
    { name: "Artist 7", popularity: 2 },
    { name: "Artist 8", popularity: 22 },
    { name: "Artist 9", popularity: 15 },
    { name: "Artist 10", popularity: 78 },
    { name: "Artist 11", popularity: 3 },
];

// tea options 
const teas = {
    leastBasic: ["Red Velvet Tea", "Toffee Tea"],
    slightlyBasic: ["Mango Green Foam Tea", "Cheese Foam Tea"],
    moreBasic: ["Matcha Latte", "Taro Milk Tea"],
    mostBasic: ["Brown Sugar Milk Tea", "Classic Milk Tea"],
};

// function to determine the tea recommendation 
function suggestBobaTea(artists: { name: string, popularity: number }[]): string {
    // sort artists by monthly listeners (descending order)
    const topArtists = artists.sort((a, b) => b.popularity - a.popularity).slice(0, 10);

    // calculate the total popularity score based on listening count ranges
    let score = 0;

    // categorize each artist by their listening count and assign a "popularity score"
    topArtists.forEach((artist) => {
        if (artist.popularity <= 20) {
            score += 0;  // least basic
        } else if (artist.popularity <= 40) {
            score += 1;  // a bit basic
        } else if (artist.popularity <= 60) {
            score += 2;  // more basic
        } else if (artist.popularity <= 80) {
            score += 3;  // more basic
        } else {
            score += 4;  // most basic
        }
    });

    // average score (based on top 10 artists)
    const averagePopularity = score / topArtists.length;

    // suggest tea based on average popularity score
    if (averagePopularity <= 1) {  // least basic 
        return teas.leastBasic[Math.floor(Math.random() * teas.leastBasic.length)];
    } else if (averagePopularity <= 2) {  // a bit basic
        return teas.slightlyBasic[Math.floor(Math.random() * teas.slightlyBasic.length)];
    } else if (averagePopularity <= 3) {  // more basic
        return teas.slightlyBasic[Math.floor(Math.random() * teas.moreBasic.length)];
    } else {  // most basic
        return teas.moreBasic[Math.floor(Math.random() * teas.mostBasic.length)];
    }
}

// bubble tea endpoint
app.get('/bubbletea', (req: Request, res: Response) => {
    const drinkRecommendation = suggestBobaTea(artists);

    res.json({
        message: `Based on your top artists, we suggest you try ${drinkRecommendation}! Enjoy! 🧋`
    });
});


// start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

