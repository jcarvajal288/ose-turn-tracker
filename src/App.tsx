import React, {useState} from 'react';
import './App.css';
import {Button, Stack, Typography} from "@mui/material";

const App = () => {

  const [turnCount, setTurnCount] = useState<number>(0);

  const die = (size: number): number => Math.floor(Math.random() * size) + 1
  const d6 = (): number => {
      const result = die(6)
      console.log(result)
      return result
  }

  const turnModulator = (mod: number) => turnCount !== 0 && turnCount % mod === 0

  const isWanderingMonster = (): 'visible' | 'hidden' => turnModulator(2) && d6() <= 1 ? 'visible' : 'hidden'
  const isRestTurn = (): 'visible' | 'hidden' => turnModulator(6) ? 'visible' : 'hidden'

  return (
    <Stack
        alignItems='center'
        gap={2}
    >
        <Typography variant='h3'>{`Turn Count: ${turnCount}`}</Typography>
        <Typography variant='h3' visibility={isWanderingMonster}>Wandering Monster</Typography>
        <Typography variant='h3' visibility={isRestTurn}>Rest Turn</Typography>
        <Button
            variant='contained'
            onClick={() => setTurnCount(turnCount + 1)}
        >
            Next Turn
        </Button>
    </Stack>
  );
};

export default App;
