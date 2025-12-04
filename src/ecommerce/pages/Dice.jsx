import { useState } from "react";
import "../../assets/css/dice.css";

// import dice images
import dice1 from "../../assets/images/dice-1.jpg";
import dice2 from "../../assets/images/dice-2.jpg";
import dice3 from "../../assets/images/dice-3.jpg";
import dice4 from "../../assets/images/dice-4.jpg";
import dice5 from "../../assets/images/dice-5.jpg";
import dice6 from "../../assets/images/dice-6.jpg";

const diceImages = [dice1, dice2, dice3, dice4, dice5, dice6];

export default function DiceGame() {
    const [currentDiceIndex, setCurrentDiceIndex] = useState(5);
    const [positions, setPositions] = useState([0]); // start before 1
    const [rolls, setRolls] = useState([]); // history of dice rolls
    const [isGameOver, setIsGameOver] = useState(false); // stop when user reaches 100

    const currentPosition = positions[positions.length - 1];

    function handleRollDice() {
        // if game is already over, ignore clicks
        if (isGameOver === true) {  return; }

        const randomIndex = Math.floor(Math.random() * 6);
        const diceValue = randomIndex + 1;
        const trackLeft = 100 - currentPosition; // kitna aur chahiye

        // Dice image har case mein update hoga
        setCurrentDiceIndex(randomIndex);

        // Agar dice value zyada hai baaki bachhe hue track se
        if (diceValue > trackLeft) {
            setRolls((prev) => {
                const nextChance = prev.length + 1;

                return [
                    ...prev,
                    {
                        chanceNumber: nextChance,
                        gotInDice: diceValue,
                        position: currentPosition,
                        blocked: true,
                        note: `You need ${trackLeft} to win the race`,
                    },
                ];
            });
        } else if (diceValue === trackLeft) {
            // Exact value needed to reach 100 => win the game
            const newPosition = 100;

            setPositions((prev) => [...prev, newPosition]);

            setRolls((prev) => {
                const nextChance = prev.length + 1;
                const chancesText =
                    nextChance === 1 ? "1 chance" : `${nextChance} chances`;

                return [
                    ...prev,
                    {
                        chanceNumber: nextChance,
                        gotInDice: diceValue,
                        position: newPosition,
                        blocked: false,
                        note: `Hurray! You won the game in ${chancesText}.`,
                    },
                ];
            });

            setIsGameOver(true);
        } else {
            // Normal valid move
            const newPosition = currentPosition + diceValue;

            setPositions((prev) => [...prev, newPosition]);

            setRolls((prev) => {
                const nextChance = prev.length + 1;

                return [
                    ...prev,
                    {
                        chanceNumber: nextChance,
                        gotInDice: diceValue,
                        position: newPosition,
                        blocked: false,
                    },
                ];
            });
        }
    }

    const cells = [];

    for (let i = 1; i <= 100; i++) {
        let cellClass = "board__cell";
        
        // Visited Cell Logic
        let isVisited = positions.includes(i);
        if (isVisited === true) {
            cellClass = cellClass + " board__cell--visited";
        }

        // Active Cell Logic
        let isActive = false;
        if (i === currentPosition) {
            isActive = true;
        }
        if (isActive === true) {
            cellClass = cellClass + " board__cell--active";
        }

        cells.push(
            <div key={i} className={cellClass}>
                <span>{i}</span>
            </div>
        );
    }

    return (
        <div className="dice-game">
            <div className="dice-game__card">
                <header className="dice-game__header">
                    <h1 className="dice-game__title">Dice Race</h1>
                    <p className="dice-game__subtitle">
                        Roll the dice and move from 1 to 100.
                    </p>
                </header>

                <div className="dice-game__content">
                    {/* Number board */}
                    <section className="board">
                        <div className="board__header">
                            <span>Board</span>
                            <span className="board__hint">1 → 100</span>
                        </div>

                        <div className="board__grid">{cells}</div>
                    </section>

                    {/* Dice area with IMAGES */}
                    <section className="dice-panel">
                        <div className="dice-panel__current">
                            <p className="dice-panel__label">Current Dice</p>
                            <div className="dice-panel__cube">
                                <img src={diceImages[currentDiceIndex]} alt={`Current dice: ${ currentDiceIndex + 1 }`} className="dice-panel__cube-img" />
                            </div>
                        </div>

                        <div className="dice-panel__faces">
                            <p className="dice-panel__label">Dice Faces</p>
                            <div className="dice-panel__faces-row">
                                {diceImages.map((imgSrc, index) => (
                                    <div key={index} className="dice-face">
                                        <img src={imgSrc} alt={`Dice ${index + 1}`} className="dice-face__img" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="dice-panel__actions">
                            <button type="button" className="btn-roll" onClick={handleRollDice} disabled={isGameOver === true} > 
                                {isGameOver === true ? "Game Over" : "Roll the Dice"}
                            </button>

                            <p className="dice-panel__info"> Current position:{" "} <strong>{currentPosition}</strong></p>

                            {/* Roll history */}
                            <div className="dice-history">
                                <p className="dice-panel__label">
                                    Roll History
                                </p>
                                <ul className="dice-history__list">
                                    {rolls.map((roll) => 
                                    (
                                        <li key={roll.chanceNumber} className="dice-history__item" >
                                            <strong>Chance {roll.chanceNumber} --> </strong> Got {roll.gotInDice},

                                            {(roll.blocked === true)? 
                                                                        ( <> stayed at {roll.position} — {" "} <span>{roll.note}</span> </>) 
                                                                    : 
                                                                        ( <> Moved to {roll.position} {(roll.note)
                                                                                                                    ? ( <> {" "} —{" "} <span> {roll.note} </span> </> ) 
                                                                                                                    : null} </> 
                                                                        )
                                            }
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
