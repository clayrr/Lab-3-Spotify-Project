//-----------------------------
//#region Database Connection
//-----------------------------
import express, { Request, Response } from 'express';


const app = express();
const port = 3000;


const energy = 0.5;

function matchEnergyLevel(energy: number): string {
  if (energy < 0.25) {
    return 'Low energy)';
  } else if (energy < 0.5) {
    return 'Moderately low energy)';
  } else if (energy < 0.75) {
    return 'Moderate energy)';
  } else {
    return 'High energy)';
  }
}

// endpoint

app.get('/track-energy', (req: Request, res: Response) => {
  const energyLevel = matchEnergyLevel(energy);

  res.json({
    message: `Based on your music taste, we have concluded that you have ${energyLevel}.`
  });
});

// start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

