import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import Vega from 'react-vega/lib/Vega';
import DirectionsCSS from "../Directions.module.css";

const createSpec = (data) => ({
   "width": 250,
   "height": 150,

   "signals": [
      {
         "name": "quantiles", "value": 20,
         "bind": { "input": "range", "min": 10, "max": 200, "step": 1 }
      },
      { "name": "mean", "update": Math.log(data.mean) },
      { "name": "sd", "value": data.sd },
      { "name": "step", "update": "1.25 * sqrt(20 / quantiles)" },
      { "name": "size", "update": "scale('x', step) - scale('x', 0)" },
      { "name": "area", "update": "size * size" },
      {
         "name": "select", "init": "quantileLogNormal(0.05, mean, sd)",
         "on": [
            {
               "events": "click, [mousedown, window:mouseup] > mousemove",
               "update": "clamp(invert('x', x()), 0.0001, 30)"
            },
            {
               "events": "dblclick",
               "update": "0"
            }
         ]
      }
   ],

   "data": [
      {
         "name": "quantiles",
         "transform": [
            {
               "type": "sequence", "as": "p",
               "start": { "signal": "0.5 / quantiles" },
               "step": { "signal": "1 / quantiles" },
               "stop": 1
            },
            {
               "type": "formula", "as": "value",
               "expr": "quantileLogNormal(datum.p, mean, sd)"
            },
            {
               "type": "dotbin",
               "field": "value",
               "step": { "signal": "step" }
            },
            {
               "type": "stack",
               "groupby": ["bin"]
            },
            {
               "type": "extent",
               "field": "y1",
               "signal": "ext"
            }
         ]
      }
   ],

   "scales": [
      {
         "name": "x",
         "domain": [5, 20],
         "range": "width"
      },
      {
         "name": "y",
         "domain": { "signal": "[0, height / size]" },
         "range": "height"
      }
   ],

   "axes": [
      { "scale": "x", "orient": "bottom" }
   ],

   "marks": [
      {
         "type": "symbol",
         "from": { "data": "quantiles" },
         "encode": {
            "enter": {
               "x": { "scale": "x", "field": "bin" },
               "y": { "scale": "y", "signal": "datum.y0 + 0.5" },
               "size": { "signal": "area" }
            },
            "update": {
               "fill": { "signal": "datum.bin < select ? 'firebrick' : 'steelblue'" }
            }
         }
      },
      {
         "type": "rule",
         "interactive": false,
         "encode": {
            "update": {
               "x": { "scale": "x", "signal": "select" },
               "y": { "value": 0 },
               "y2": { "signal": "height" },
               "stroke": { "signal": "select ? '#ccc': 'transparent'" }
            }
         }
      },
      {
         "type": "text",
         "interactive": false,
         "encode": {
            "enter": {
               "baseline": { "value": "top" },
               "dx": { "value": 3 },
               "y": { "value": 2 }
            },
            "update": {
               "x": { "scale": "x", "signal": "select" },
               "text": { "signal": "format(cumulativeLogNormal(select, mean, sd), '.1%')" },
               "fill": { "signal": "select ? '#000': 'transparent'" }
            }
         }
      }
   ]
});

const QuantileDotsPlot = ({ totalPredictions }) => {
   const [data, setData] = useState();

   useEffect(() => {
      let obj = {};
      obj.mean = getMean(totalPredictions);
      obj.sd = getStandardDeviation(totalPredictions);
      setData(obj);

   }, [totalPredictions]);

   if (!data) return "";

   console.log(data);

   // Spec created with the results
   let spec = createSpec(data);

   return (
      <div className={DirectionsCSS.quantile_graph}>
         <Vega spec={spec} />
      </div>
   );

   // Function to get the mean time
   function getMean(array) {
      const sum = array.reduce((a, b) => a + b, 0);
      return (sum / array.length) || 0;
   }

   // Function to get the standard deviation
   function getStandardDeviation(array) {
      const n = array.length;
      const mean = array.reduce((a, b) => a + b) / n;
      return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
   }
};

export default QuantileDotsPlot;
