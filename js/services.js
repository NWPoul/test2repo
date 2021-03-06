/* global
 GVAR
*/



var _date = {
  m30: 1800000, //30*60*1000
  hr24: 86400000, //24*60*60*1000

  timeStrToMS: function timeStrToMS(str) {
    //'24.01.2019 08:00';
    var timeArr = str.split(/[.:\s]/);
    var FTime_ms = Date.UTC(
      +timeArr[2],
      +timeArr[1]-1, // Month in JS starts from 0 !!!
      +timeArr[0],
      +timeArr[3],//-3, // hours => per UTC !
      +timeArr[4] );
    return FTime_ms;
  },

  dateMsToDateN: function dateMsToDateN(dateMs) {
    let dateN = Math.trunc( dateMs / 86400000 );
    return dateN;
  },

  dateToYYYYMMDD: function dateToYYYYMMDD(srcDate, delimeter) {
    delimeter = delimeter || '';
    var year =   srcDate.getFullYear(),
      month = (+srcDate.getMonth()+1),
      day =    +srcDate.getDate();
    var resDate = year + delimeter
               + ( (month>9) ? month : ('0' + month) ) + delimeter
               + ( (day>9)   ? day   : ('0' + day)   );
    return resDate;
  },

  msToSlotN: function(msTime) {
    let slotN = ( msTime - _date.dateMsToDateN(msTime) * _date.hr24 ) / _date.m30;
    return slotN;
  },

  msToCustomDateObj: function msToCustomDateObj(msTime, toggleGMT) {
  // var SSTime = (jsTime+3*60*60*1000)/1000/60/60/24+25569;
    if(toggleGMT === true) {msTime -= GVAR.GMToffset;}
    let date = new Date(msTime);
    let dateObj = _date.customDate(date);
    return dateObj;
  },// end parse msToCustomDateObj

  customDate: function customDate ( date ) {
    let timeMS = date.getTime();
    let dateN = _date.dateMsToDateN(timeMS);
    let monthN = date.getUTCMonth();
    let dayN = date.getUTCDate();
    let time = date.getUTCHours() + ':' + ( (+date.getUTCMinutes() >= 30) ? '30' : '00' );
    let dayWeekN = date.getUTCDay();
    let HDay = _date.isHoliday(monthN, dayN, dayWeekN);

    let dayName = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    let dateObj = {
      time: time,
      dateN: dateN,
      monthN: +monthN+1,
      dayN: dayN,
      dayName: dayName[dayWeekN],
      HDay: HDay
    };
    // let JSONdateObj = JSON.stringify(dateObj)
    return dateObj;//[time, monthN, dayN, dayName[dayWeekN], HDay];
  },//end customDate

  isHoliday: function isHoliday(monthN, dayN, dayWeekN) {
    var holidays2020 = [
      [1,2,3,6,7,8], //[0]JAN 2020
      [24],            //[1]FEB
      [9],           //[2]MAR
      [],            //[3]ARP
      [1,4,5,11],  //[4]MAY
      [12],          //[5]JUN
      [],[],[],[],   //JUL//AUG//SEP//OKT
      [4], []        //[10]NOV//DEC
    ];

    if (dayWeekN == 0 || dayWeekN == 6) {
      return true;
    } else if (holidays2020[monthN].indexOf(dayN)!= -1) {
      return true;
    }
    return false;
  }//end isHoliday

}; // ===== END custom DATE OBJ ===== custom DATE OBJ ===== custom DATE OBJ ===== custom DATE OBJ =====


function disableCSS(cssID, command) {
  let CSSlink = document.getElementById(cssID);
  let stylesheet = CSSlink.sheet;
  stylesheet.disabled = command;
}

function setTimeSlotArr() {
  let timeSlotArr = [];
  for (let i = 0; i <= 23; i++ ) {
    timeSlotArr.push([i*2*_date.m30, i*100+0, i + ':00' ]);
    timeSlotArr.push([i*2*_date.m30 + _date.m30, i*100+30, i + ':30']);
  }
  return(timeSlotArr);
}//end setTimeSlotArr


function timeIndexFunc(arg, mode) {
  arg = +arg;
  var result;

  switch (mode) {
  case 'index':
    result = Math.ceil( (arg / 100)*2 );
    break;
  case 'time':
    result = arg*50 - (arg%2*20);
    break;
  case 'next':
    result = (arg > 2300) ? 0 :
      arg + ( (arg%100) ? 70 : 30 );
    break;
  }
  return(result);
}//end timeIndexFunc


function setButtonText(buttonId, text) {
  if (!text || !buttonId) return;
  let button = document.getElementById(buttonId);
  button.innerText = text;

}

function setButtonVis(buttonId, visible) {
  let button = document.getElementById(buttonId);
  // let ButtonClasses = button.classList;
  if (visible) {
    button.hidden = false;
  } else {
    button.hidden = true;
  }
}


function getSVGicon(iconName) {
  let iconPack = {
    stopwatch: `<svg width="14" height="14" viewBox="0 0 16 16">
        <path d="M8 3.019v-1.019h2v-1c0-0.552-0.448-1-1-1h-3c-0.552 0-1 0.448-1 1v1h2v1.019c-3.356 0.255-6 3.059-6 6.481 0 3.59 2.91 6.5 6.5 6.5s6.5-2.91 6.5-6.5c0-3.422-2.644-6.226-6-6.481zM11.036 13.036c-0.944 0.944-2.2 1.464-3.536 1.464s-2.591-0.52-3.536-1.464c-0.944-0.944-1.464-2.2-1.464-3.536s0.52-2.591 1.464-3.536c0.907-0.907 2.101-1.422 3.377-1.462l-0.339 4.907c-0.029 0.411 0.195 0.591 0.497 0.591s0.527-0.18 0.497-0.591l-0.339-4.907c1.276 0.040 2.47 0.555 3.377 1.462 0.944 0.944 1.464 2.2 1.464 3.536s-0.52 2.591-1.464 3.536z">
        </path>
      </svg>`,
    toggleLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-toggle-left">
          <rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect>
          <circle cx="8" cy="12" r="3"></circle>
        </svg>`
  };
  return iconPack[iconName];
}



function setDayHeaderObserver() {
  var options = {
    root: document.getElementById('inner'),
    rootMargin: '-15% 0% 0% 0%'
  };
  var callback = function(entries, observer) {
    let dayHeaderId = 'divHeader';
    var dayHeader = document.getElementById(dayHeaderId);

    entries.forEach(entry => {
      changeHeader(entry, dayHeader);
    });
  };

  GVAR.dayHeaderObserver = new IntersectionObserver(callback, options);
  var mainTable = document.getElementById('mainTable');
  var headers = mainTable.getElementsByClassName('newDayTr');

  for (let header of headers) {
    GVAR.dayHeaderObserver.observe(header);
    console.log('now observe ' +header);
  }

}// end testObserver

function changeHeader(entry, dayHeader) {
  let xOffset = 10;
  let yOffset = ( entry && entry.isIntersecting ) ? 1 : 40;
  if( !dayHeader ) {
    let dayHeaderId = 'divHeader';
    dayHeader = document.getElementById(dayHeaderId);
console.log('rev changeHeader!');
  }

  let curElem = findCurElem('divHeader', xOffset, yOffset);
  let curTbody = findParent(curElem, 'TBODY');
  let curTbodyHeader = curTbody.rows[0].cells[2];
  let dayHeaderText = curTbodyHeader.innerHTML;
  if (dayHeader.innerHTML != dayHeaderText) {
    dayHeader.innerHTML = dayHeaderText;
    dayHeader.setAttribute('data-day', curTbody.id);
  }
}// end of changeHeader

function findCurElem(anchorId, xOffset = 1, yOffset = 1, yRef = 'bottom') {
  let anchor = document.getElementById(anchorId);
  let anchorRect = anchor.getBoundingClientRect();
  let xPos = anchorRect.left + xOffset;
  let yPos = anchorRect[yRef] + yOffset;

 // showTargetCoordinates(xPos+1, yPos+1); //DEVELOPING

  let curElem = document.elementFromPoint(xPos, yPos);
  console.log(curElem);
  return curElem;
}

function findParent(elem, targetTagName) {
  while ( (elem = elem.parentElement) && (elem.tagName != targetTagName) );
  return elem;
}

// function showTargetCoordinates(xPos=0, yPos=0) {
//   let curLines = document.body.getElementsByClassName('markLine');
//   if (curLines.length > 0) {
//     while (curLines[0]) { curLines[0].remove(); }
//   }

//   let hLine = document.createElement('hr');
//   hLine.id = 'hLine';
//   hLine.className = 'markLine';
//   hLine.style.cssText = ' top:' +yPos +'px; left: 0; height: 1px; width: 100%' ;


//   let vLine = document.createElement('hr');
//   vLine.id = 'vLine';
//   vLine.className = 'markLine';
//   vLine.style.cssText = 'left:' +xPos +'px; top: 0; height: 100%; width: 1px';

//   document.body.appendChild(hLine);
//   document.body.appendChild(vLine);
// }




/*
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
POST REQUEST ----- POST REQUEST ----- POST REQUEST ----- POST REQUEST
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
*/

function promisedPOST(url, params) {
  return new Promise( function(resolve, reject) {
    var paramsQstring = '';
    for (let param in params){
      paramsQstring += '&' + param + '=' + params[param];
    }

    var req = new XMLHttpRequest();

    req.open('post', url);

    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    req.onload = function() {
      if (req.status == 200) {
        resolve(req.response);
      } else {
        reject(Error(req.statusText));
      }
    };
    // handle network errors
    req.onerror = function() {
      reject(Error('Network Error'));
    };
    // make the request
    req.send(paramsQstring);
  });
}//===END promisedPOST================================================
