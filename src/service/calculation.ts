import { addKey } from "../helpers/addNewRow";
import { compareStringCoeffData } from "../scripts/compareString";
import { EStatusRows, IAnswerSection, IRow, ITitleRow } from "../constants/types/types";
import dataPreparation, { IPreparedTitleRow } from "../scripts/dataPreparation";

const reducer = ((accumulator: number, currentValue: number) => accumulator + currentValue);

const enum EParametersCalc {
  RDF = "rdf",
  TAILS = "tails",
  MASSA = "massa"
}
function calculationOfTableData(tableActive: (IRow | ITitleRow)[]) {
  const preparedData: IPreparedTitleRow[] = dataPreparation(tableActive);
  const recalculationOfSortingData: IPreparedTitleRow[] = dataAfterSortingSectionSorting(preparedData);
  const massaHeatOfCombustion = calculationTheHeatOfCombustion(recalculationOfSortingData, EParametersCalc.MASSA);
  const rdfHeatOfCombustion = calculationTheHeatOfCombustion(recalculationOfSortingData, EParametersCalc.RDF);
  const tailsHeatOfCombustion = calculationTheHeatOfCombustion(recalculationOfSortingData, EParametersCalc.TAILS);
  const answer: IAnswerSection = {
    answer: {
      sectionOne: massaHeatOfCombustion,
      sectionTwo: {
        rdf: rdfHeatOfCombustion,
        tails: tailsHeatOfCombustion,
        preparedData: preparedData
      }
    }
  };
  return answer;
}

function calculationTheHeatOfCombustion(
  dataTable: IPreparedTitleRow[],
  parametr?: EParametersCalc
) {
  if (!parametr) parametr = EParametersCalc.MASSA
  const rowTable: any[] = [];
  dataTable.forEach(element => {
    if (element.rowsItems) {
      element.rowsItems.data.forEach(rowItem => {
        rowTable.push(rowItem);
      });
    }
  });
  //Влажность переменные
  const massTimesMoisture = [];// Массив данных влажность умноженная на
  ////////////////////////////////////////////////
  //Зольность переменные
  const leftAshContentTop = []; //левое уравнение верхней части дроби
  const leftAshContentBottom = []; //левое уравнение нижней части дроби
  //////////////////////////////////////////////////////
  //Теплота сгорания переменные
  const leftHeat = []; //первая часть уравнения
  /////////////////////////////////////////////////
  for (const element of rowTable) {
    /////////////// Расчет общей влажности //////////////////
    massTimesMoisture.push(element[parametr] * element.humidity);
    /////////////////////////////////////
    ///////////////// //Расчёт общей Зольности //////////////////////
    leftAshContentTop.push(element[parametr] * element.ash * (100 - element.humidity));
    leftAshContentBottom.push(element[parametr] * (100 - element.humidity));
    ////////////////////////////////////////////////////////////
    ///////////////////Удельная теплота сгорания
    leftHeat.push(element[parametr] * (1 - element.humidity / 100) * (1 - element.ash / 100) * element.heat);
    ////////////////////////////////////////////////////////
  };


  const humidity = massTimesMoisture.reduce(reducer);
  const ash = (leftAshContentTop.reduce(reducer) / leftAshContentBottom.reduce(reducer)) * (1 - (humidity / 100 / 100));
  const heat = (leftHeat.reduce(reducer) - 0.02442 * humidity) / 100;
  const resultCalcFunction = {
    humidity: humidity / 100,
    ash: ash,
    heat: heat
  };
  return resultCalcFunction;
}

function dataAfterSortingSectionSorting(dataTable: IPreparedTitleRow[]) {
  dataTable.forEach((element: IPreparedTitleRow) => {
    element.rowsItems.data.forEach((rowItem: IRow) => {
      rowItem.rdf = Math.floor(rowItem.coeff * rowItem.massa * 100) / 100;
      rowItem.tails = Math.floor((1 - rowItem.coeff) * rowItem.massa * 100) / 100;
    });
  });
  return dataTable;
};
export { calculationOfTableData };