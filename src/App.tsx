import React, {FormEvent, useMemo, useState} from 'react';
import './App.css';
import {Box, Button, Divider, Modal, Stack, TextField, Typography} from "@mui/material";
import {CustomLabelModal} from "./CustomLabelModal";

type Timer = {
    label: string
    turnsLeft: number
}

const App = () => {

    const [turnCount, setTurnCount] = useState<number>(0);
    const [timers, setTimers] = useState<Timer[]>([]);
    const [isCustomTimerModalVisible, setIsCustomTimerModalVisible] = useState<boolean>(false);
    const [dieExpression, setDieExpression] = useState<string>("");
    const [dieRollResult, setDieRollResult] = useState<string>("blank");

    const die = (size: number): number => {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array)
        const randomByte = array[0];
        return Math.floor(randomByte % size) + 1
    }
    const d4 = (): number => die(4)
    const d6 = (): number => die(6)
    const d8 = (): number => die(8)
    const d10 = (): number => die(10)
    const d12 = (): number => die(12)
    const d20 = (): number => die(20)
    const d100 = (): number => die(100)

    const DieButton = (dieFunc: () => number, label: string) => (
        <Button
            variant='contained'
            onClick={() => {
                setDieRollResult(dieFunc().toString(10))
            }}
        >
            {label}
        </Button>
    )

    const evaluateDieFormula = () => {
        const dieRegex = /[+|-]?\d*d\d+/;
        const constantRegex = /[+|-]\d+[^d]/;
        const dieRolls = dieExpression.match(dieRegex) || []
        const constants = dieExpression.match(constantRegex) || []
        const dieResults = dieRolls.flatMap((dieRoll) => {
            const [multiplier, dieSize] = dieRoll.split('d');
            const numRolls = Math.abs(Number(multiplier))
            const sign = Math.sign(Number(multiplier))
            return new Array(numRolls).fill(sign).map((n) => n * die(Number(dieSize)))
        })
        const allResults = (dieResults.concat(constants.map((c) => Number(c))))
        const answer = allResults.reduce((a, b) => a + b)
        setDieRollResult(answer.toString(10))
    }

    const getTimePassed = (): string => {
        const hours = Math.floor(turnCount / 6)
        const minutes = turnCount % 6
        return `${hours}:${minutes}0`
    }

    const addTimer = (label: string, numTurns: number) => {
        const newTimer: Timer = {
            label: label,
            turnsLeft: numTurns
        }
        setTimers(timers.concat([newTimer]))
    }

    const advanceTurn = () => {
        setTurnCount(turnCount + 1)
        const newTimers = timers
            .filter((timer) => timer.turnsLeft > 1)
            .map((timer): Timer => {
                return {label: timer.label, turnsLeft: timer.turnsLeft - 1}
            })
        setTimers(newTimers)
    }


    const turnModulator = (threshold: number) => turnCount !== 0 && turnCount % threshold === 0

    const isWanderingMonster: 'visible' | 'hidden' = useMemo((): 'visible' | 'hidden' => {
        return turnModulator(2) && d6() <= 1 ? 'visible' : 'hidden';
    }, [turnCount]);

    const isRestTurn: 'visible' | 'hidden' = useMemo((): 'visible' | 'hidden' => {
        return turnModulator(6) ? 'visible' : 'hidden';
    }, [turnCount]);

    return (
        <Stack
            alignItems='center'
            gap={2}
        >
            <Stack width='50%' direction='row' justifyContent='space-between'>
                <Typography variant='h3'>{`Turn Count: ${turnCount}`}</Typography>
                <Typography variant='h3'>{`Time passed: ${getTimePassed()}`}</Typography>
            </Stack>
            <Typography variant='h3' visibility={isWanderingMonster}>Wandering Monster</Typography>
            <Typography variant='h3' visibility={isRestTurn}>Rest Turn</Typography>
            <Stack
                width='50%'
                direction='row'
                justifyContent='space-around'
            >
                {
                    timers.map((timer) => (
                        <Typography variant='h5'>{`${timer.label}: ${timer.turnsLeft}`}</Typography>
                    ))
                }
            </Stack>
            <Button
                variant='contained'
                onClick={advanceTurn}
            >
                Next Turn
            </Button>
            <Stack direction='row' gap={4}>
                <Button onClick={() => addTimer('Torch', 6)}>
                    Add Torch
                </Button>
                <Button onClick={() => addTimer('Lantern', 24)}>
                    Add Lantern
                </Button>
            </Stack>
            <Button onClick={() => setIsCustomTimerModalVisible(true)}>
                Add Custom Timer
            </Button>
            <Divider/>
            <Typography
                variant='h5'
                visibility={dieRollResult === 'blank' ? 'hidden' : 'visible'}
            >
                {dieRollResult}
            </Typography>
            <Stack gap={3} alignItems='center'>
                <Stack direction='row' gap={3}>
                    {DieButton(d4, 'd4')}
                    {DieButton(d6, 'd6')}
                    {DieButton(d8, 'd8')}
                </Stack>
                <Stack direction='row' gap={3}>
                    {DieButton(d10, 'd10')}
                    {DieButton(d12, 'd12')}
                    {DieButton(d20, 'd20')}
                </Stack>
                {DieButton(d100, 'd100')}
                <Stack
                    sx={{ mt: 2 }}
                >
                    <TextField
                        label='Die Formula'
                        helperText='e.g. 3d6+5'
                        onChange={(e) => setDieExpression(e.target.value)}
                    />
                    <Button
                        variant='contained'
                        onClick={() => evaluateDieFormula()}
                    >
                        Roll
                    </Button>
                </Stack>
            </Stack>
            <Modal
                open={isCustomTimerModalVisible}
            >
                <Box>
                    <CustomLabelModal
                        closeModal={() => setIsCustomTimerModalVisible(false)}
                        addTimer={addTimer}
                    />
                </Box>
            </Modal>
        </Stack>
    );
};

export default App;
