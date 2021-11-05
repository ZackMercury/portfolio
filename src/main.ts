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