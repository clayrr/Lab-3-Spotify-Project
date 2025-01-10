import express, { Request, Response } from 'express';

const app = express();
const port = 3000;
const energy: number; 

//get spotify API stuff - code from the website - ...?  - it doesn't work :(
/*curl --request GET \
  --url https://api.spotify.com/v1/audio-features/11dFghVXANMlKmJXsNCbNl \
  --header 'Authorization: Bearer 1POdFZRZbvb...qqillRxMr2z'
*/
//need: client id, spotify track ID

//use the energy level of the top track they listen to
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


