
import React from "react";

import { FEATURES } from "../config";
import Tooth from "./Tooth";

type TeethGridProps = {
    teethLayout: {
        topLeft: number[];
        topRight: number[];
        bottomLeft: number[];
        bottomRight: number[];
    };
    currentElastic: number[];
    disabledTeeth: number[];
    handleToothClick: (number: number) => void;
    handleToothToggle: (number: number) => void;
    setToothRef: (number: number, ref: HTMLButtonElement) => void;
    isMirrorView: boolean;
    svgRef: React.MutableRefObject<SVGSVGElement | null>;
};

export function TeethGrid({ teethLayout, currentElastic, disabledTeeth, handleToothClick, handleToothToggle, setToothRef, isMirrorView, svgRef

 }: TeethGridProps) {

    return (
        <div className="max-w-screen mx-auto bg-blue-200 overflow-hidden sm:rounded-full py-8 px-4 max-w-md overflow-x-auto">
            <div
                className={`grid grid-cols-2 relative -my-16 ${isMirrorView ? "transform scale-x-[-1]" : ""
                    }`}
            >
                <svg
                    ref={svgRef}
                    className="absolute inset-0 pointer-events-none z-10 drop-shadow max-w-4xl"
                    style={{ width: "100%", height: "100%" }}
                ></svg>
                <div className="flex flex-col-reverse items-start">
                    {teethLayout.topLeft.map((tooth) => (
                        <Tooth
                            key={tooth}
                            number={tooth}
                            row={0}
                            onClick={handleToothClick}
                            onToggle={handleToothToggle}
                            selected={currentElastic.includes(tooth)}
                            disabled={
                                FEATURES.DISABLE_TEETH && disabledTeeth.includes(tooth)
                            }
                            setRef={setToothRef}
                            isMirrorView={isMirrorView}
                        />
                    ))}
                </div>
                <div className="flex flex-col items-end">
                    {teethLayout.topRight.map((tooth) => (
                        <Tooth
                            key={tooth}
                            number={tooth}
                            row={0}
                            onClick={handleToothClick}
                            onToggle={handleToothToggle}
                            selected={currentElastic.includes(tooth)}
                            disabled={
                                FEATURES.DISABLE_TEETH && disabledTeeth.includes(tooth)
                            }
                            setRef={setToothRef}
                            isMirrorView={isMirrorView}
                        />
                    ))}
                </div>
                <div className="flex flex-col items-start">
                    {teethLayout.bottomLeft.map((tooth) => (
                        <Tooth
                            key={tooth}
                            number={tooth}
                            row={1}
                            onClick={handleToothClick}
                            onToggle={handleToothToggle}
                            selected={currentElastic.includes(tooth)}
                            disabled={
                                FEATURES.DISABLE_TEETH && disabledTeeth.includes(tooth)
                            }
                            setRef={setToothRef}
                            isMirrorView={isMirrorView}
                        />
                    ))}
                </div>
                <div className="flex flex-col-reverse items-end">
                    {teethLayout.bottomRight.map((tooth) => (
                        <Tooth
                            key={tooth}
                            number={tooth}
                            row={1}
                            onClick={handleToothClick}
                            onToggle={handleToothToggle}
                            selected={currentElastic.includes(tooth)}
                            disabled={
                                FEATURES.DISABLE_TEETH && disabledTeeth.includes(tooth)
                            }
                            setRef={setToothRef}
                            isMirrorView={isMirrorView}
                        />
                    ))}
                </div>
            </div>
        </div>
    )

}
