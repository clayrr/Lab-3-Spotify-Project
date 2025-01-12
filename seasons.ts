import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

// simulated value for demonstration
const danceability = 0.79;

// helper function to classify danceability into seasons with descriptive messages
function matchDanceabilityToSeason(danceability: number): string {
  if (danceability < 0.25) {
    return 'your music vibe is like winter: calm,and introspective. you are like a cup of hot chocolate on a snow day';
  } else if (danceability < 0.5) {
    return 'your music vibe is like autumn: mellow and reflective. you are like drinking a cup of hot apple cider in a pumpkin patch';
  } else if (danceability < 0.75) {
    return 'your music vibe is like spring: fresh and lively. you are like drinking herbal tea in a meadow';
  } else {
    return 'your music vibe is like summer: vibrant and energetic. you are like drinking lemonade by the pool';
  }
}

// danceability to season endpoint
app.get('/season', (req: Request, res: Response) => {
  const seasonMessage = matchDanceabilityToSeason(danceability);

  res.json({
    message: `based on your music taste, ${seasonMessage}`
  });
});

// start the server
app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
