import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
   selector: 'app-grid-base',
   templateUrl: './grid-base.component.html',
   styleUrls: ['./grid-base.component.css']
})
export class GridBaseComponent implements OnInit {

   colArray = [];
   rowArray = [];
   colums = 7;
   rows = 6;
   isPlayer1: boolean;
   isPlayer2: boolean;
   selectedId = [];
   playerFirst = [];
   playerSecond = [];

   constructor(@Inject(DOCUMENT) public document: Document) { }

   ngOnInit() {
      this.isPlayer1 = true;
      this.setGrid();
   }

   setGrid() {
      this.colArray = [];
      this.rowArray = [];
      for (let i = 0; i < this.rows; i++) {
         this.rowArray.push(i);
      }
      for (let i = 0; i < this.colums; i++) {
         this.colArray.push(i);
      }
   }

   checkVerticalPossibilities(data, player: string) {
      for (let j = 0; j < data.length; j++) {
         const found = this[player].find(element => element === data[j]);
         if (!found) {
            return;
         } else if (j === data.length - 1) {
            setTimeout(() => {
               alert(player + ' Win');
               location.reload();
            }, 100);
         }
      }
   }

   checkHorizontal(horizontalLength, curRow, horizontalCheck, player) {
      const possibiltyArr = [];
      for (let j = 0 ; j < horizontalLength; j++) {
         const index = curRow + '-' + horizontalCheck++;
         possibiltyArr.push(index);
      }
      for (let j = 0; j < possibiltyArr.length; j++) {
         if (j + 4 <= possibiltyArr.length) {
            const sortedArr = [];
            for (let k = j; k < j + 4; k++) {
                sortedArr.push(possibiltyArr[k]);
            }
            this.checkVerticalPossibilities(sortedArr, player);
         } else {
            break;
         }
      }
   }

   checkDigonalLeftToRight(row, col, player) {
      const possibiltyArr = [];
      let rowLength = row - 3;
      let colLength = col - 3;
      for (let i = 0; i < 7; i ++) {
         if ((rowLength >= 0 && colLength >= 0) && (rowLength < this.colums && colLength <= this.rows)) {
            const element = rowLength + '-' + colLength;
            possibiltyArr.push(element);
         }
         rowLength++;
         colLength++;
      }
      for (let j = 0; j < possibiltyArr.length; j++) {
         if (j + 4 <= possibiltyArr.length) {
            const sortedArr = [];
            for (let k = j; k < j + 4; k++) {
                sortedArr.push(possibiltyArr[k]);
            }
            this.checkVerticalPossibilities(sortedArr, player);
         } else {
            break;
         }
      }
   }

   checkDigonalRightToLeft(row, col, player) {
      const possibiltyArr = [];
      let rowLength = row + 3;
      let colLength = col - 3;
      for (let i = 0; i < 7; i ++) {
         if ((rowLength < this.rows && colLength >= 0) && (rowLength >= 0 && colLength <= this.colums)) {
            const element = rowLength + '-' + colLength;
            possibiltyArr.push(element);
         }
         rowLength--;
         colLength++;
      }
      for (let j = 0; j < possibiltyArr.length; j++) {
         if (j + 4 <= possibiltyArr.length) {
            const sortedArr = [];
            for (let k = j; k < j + 4; k++) {
                sortedArr.push(possibiltyArr[k]);
            }
            this.checkVerticalPossibilities(sortedArr, player);
         } else {
            break;
         }
      }
   }

   checkPlayerWins(player: string) {
      const currentIndex = this[player][this[player].length - 1];
      const possibiltyArr = [];
      possibiltyArr.push(currentIndex);
      const arr = currentIndex.split('-');
      const currentRow = parseInt(arr[0], 10);
      const currentCol = parseInt(arr[1], 10);
      let verticalCheck  = currentRow;
      let horizontalCheck;
      const horizontalCheckLength = currentCol + 4;
      if (currentCol >= 3) {
         horizontalCheck = currentCol - 3;
      } else {
         horizontalCheck = 0;
      }
      for (let i = 0 ; i < 3; i++) {
         const prevIndex = ++verticalCheck + '-' + currentCol;
         possibiltyArr.push(prevIndex);
      }
      this.checkVerticalPossibilities(possibiltyArr, player);
      this.checkHorizontal(horizontalCheckLength, currentRow, horizontalCheck, player);
      this.checkDigonalLeftToRight(currentRow, currentCol, player);
      this.checkDigonalRightToLeft(currentRow, currentCol, player);
   }

   setPlayersArr(id) {
      this.playerFirst = [];
      this.playerSecond = [];
      for (let i = 0; i < id.length; i++) {
         if (i % 2 === 0) {
            this.playerFirst.push(id[i]);
         } else {
            this.playerSecond.push(id[i]);
         }
      }
      if (this.playerFirst.length > this.playerSecond.length) {
         if (this.playerFirst.length > 3) {
            this.checkPlayerWins('playerFirst');
         }
      } else {
         if (this.playerSecond.length > 3) {
            this.checkPlayerWins('playerSecond');
         }
      }
   }

   selectedDisc(row, col) {
      const id = row + '-' + col;
      const found = this.selectedId.find(element => element === id);
      if (!found) {
         const belowId = ++row + '-' + col;
         const belowGrid =  this.selectedId.find(element => element === belowId);
         if (belowGrid) {
            this.selectedId.push(id);
            this.setBackgroundColor(id);
         } else if (row === this.rows) {
            this.selectedId.push(id);
            this.setBackgroundColor(id);
         }
         this.setPlayersArr(this.selectedId);
      }
   }

   setBackgroundColor(id) {
      const currentGrid = this.document.getElementById(id);
      if (this.isPlayer1) {
         currentGrid.setAttribute('style', ' background-color: red');
      } else {
         currentGrid.setAttribute('style', ' background-color: yellow');
      }
      this.isPlayer1 = !this.isPlayer1;
   }
}
