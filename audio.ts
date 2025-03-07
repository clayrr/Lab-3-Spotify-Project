//-----------------------------
//#region Database Connection
//-----------------------------
import express, { Request, Response } from 'express';

/*
import path from "path";
import sqlite3 from "sqlite3";
import { RequestHandler } from "express-serve-static-core";
import { ParsedQs } from "qs";
const sqlite = sqlite3.verbose();
const dbFile = path.join(__dirname, "foo.db");
// below is the line for vanilla ES6 js to work; not necessary with typescript
// const dbFile = path.join(path.dirname(fileURLToPath(import.meta.url)), "foo.db");
const db = new sqlite.Database(dbFile, (error) => {
  if (error) return console.error(error.message);
  console.log(`Connected to database ${dbFile}`);
});*/


const app = express();
const port = 8888;


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
  

