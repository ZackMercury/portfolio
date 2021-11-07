import Matrix from './utils/Matrix';
import LCG from './utils/ParkMillerRandom';

//#region Animations

let sections = ["header", "article", "footer"]
               .map(str => [...document.getElementsByTagName(str)])
               .reduce((a, b) => a.concat(b), []);

let observer:IntersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        if(entry.isIntersecting)
            target.classList.add("active");
        else
            target.classList.remove("active")
    })
}, {
    threshold: 0,
    rootMargin: "-200px"
});

sections.forEach(section => observer.observe(section));

//#endregion

//#region Grid generation

interface Point { 
    x:number;
    y:number;
}

const NUM_ENTRIES = 500;

const MIN = 0;
const MAX = 5;
const rand: Function = LCG();

const m = new Matrix<number>(1, 1);
m.data[0][0] = 0;
let maxDistance = 0;
for (let i = 1; i < NUM_ENTRIES; i ++)
{
    const row = m.getBottomRow();
    
    const busyIndices = [];
    for (let j = 0; j < row.length; j ++)
        if (row[j] != null) 
            busyIndices.push(j);
    
    const lastRowIndex = m.rows - 1;
    const randomIndex = busyIndices[Math.floor(rand()*busyIndices.length)];
    
    const availableDirections:Point[] = [{x: randomIndex, y: lastRowIndex + 1}];
    if (m.get(randomIndex, lastRowIndex - 1) == null)
        availableDirections.push({x: randomIndex, y: lastRowIndex - 1});
    if ((randomIndex - 1 >= MIN || maxDistance < 5) && m.get(randomIndex - 1, lastRowIndex) == null)
        availableDirections.push({x: randomIndex - 1, y: lastRowIndex});
    if ((randomIndex + 1 <= MAX || maxDistance < 5) && m.get(randomIndex + 1, lastRowIndex) == null)
        availableDirections.push({x: randomIndex + 1, y: lastRowIndex});

    const randomPoint:Point = availableDirections[Math.floor(rand()*availableDirections.length)];
    if (randomPoint.x < 0) {
        randomPoint.x ++;
        m.shiftRight();
        maxDistance ++;
    } else if (randomPoint.x > m.cols - 1) {
        m.addColumnRight();
        maxDistance ++;
    } else if (randomPoint.y < 0) {
        randomPoint.y ++;
        m.shiftBottom();
    } else if (randomPoint.y > m.rows - 1) {
        m.addRowBottom();
    }
    
    m.data[randomPoint.x][randomPoint.y] = i;
}

//#endregion

//#region Grid rendering

const table = document.createElement("table");
for (let oy = 0; oy < m.rows; oy ++)
{
    const row = table.insertRow();
    for (let ox = 0; ox < m.cols; ox ++)
    {
        const cell = row.insertCell();
        cell.appendChild(document.createTextNode(((m.data[ox][oy] != null)?m.data[ox][oy]:"").toString()));
    }
}    




const main = document.getElementsByTagName("main")[0];
main.appendChild(table);

//#endregion