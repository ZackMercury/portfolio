import Matrix from './utils/Matrix';
import LCG from './utils/ParkMillerRandom';


//#region Grid generation

interface Point { 
    x:number;
    y:number;
}

//@ts-ignore
const NUM_ENTRIES = __ARTICLES__;

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
const CENTER = (MIN + MAX) / 2;

const table = document.createElement("table");
table.id = "articles";
for (let oy = 0; oy < m.rows; oy ++)
{
    const row = table.insertRow();
    for (let ox = 0; ox < m.cols; ox ++)
    {
        const cell = row.insertCell();
        if (m.data[ox][oy] == null) continue;
        const article = document.createElement("article");
        article.style.textAlign = "center";
        const offset = ox - CENTER;
        

        article.style.left = offset*150 + "px";

        article.appendChild(document.createTextNode((m.data[ox][oy]).toString()));
        cell.appendChild(article);
    }
}    

const main = document.getElementsByTagName("main")[0];
main.appendChild(table);

//#endregion

//#region Animations

let sections = ["header", "footer"]
               .map(str => [...document.getElementsByTagName(str)])
               .reduce((a, b) => a.concat(b), []);

let observer:IntersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        let target: HTMLElement = entry.target as HTMLElement;
        if (entry.isIntersecting)
            target.classList.add("active");
        else
            target.classList.remove("active")
    })
}, {
    threshold: 0,
    rootMargin: "-150px"
});

sections.forEach(section => observer.observe(section));

let cellObserver:IntersectionObserver = new IntersectionObserver((entries) => {
    console.log(entries);
    entries.forEach((entry) => {
        if (!entry.target.children.length) return;

        let target: HTMLDivElement = entry.target.children[0] as HTMLDivElement;
        if (entry.isIntersecting)
            target.classList.add("active");
        else
            target.classList.remove("active")
    })
}, {
    threshold: 0,
    rootMargin: "-150px"
});

[...document.getElementsByTagName("td")].forEach(cell => cellObserver.observe(cell))

//#endregion