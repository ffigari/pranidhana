interface SeedsPlanter {
  plantSeed(): void
}

interface TreeContemplator {
  watchTrees(): void
}

function asSeedsPlanter<T extends { name: string }>(obj: T): T & SeedsPlanter {
  return Object.assign(obj, {
    plantSeed() {
      console.log(obj.name, "planted a seed")
    }
  })
}

function asTreeContemplator<T extends { name: string }>(obj: T): T & TreeContemplator {
  return Object.assign(obj, {
    watchTrees() {
      console.log(obj.name, "watched a tree")
    }
  })
}

const sam = asTreeContemplator(new (class {
  name: string = "sam"
}))

const julia = asSeedsPlanter(asTreeContemplator(new (class {
  name: string = "julia"
})))

let samSelected = true;
let juliaSelected = false;

const selectTreeContemplator = (): TreeContemplator | null => {
  if (samSelected) {
    return sam;
  } else if (juliaSelected) {
    return julia
  }

  return null
}

const selectSeedsPlanter = (): SeedsPlanter | null => {
  if (juliaSelected) {
    return julia
  }

  return null
}

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding("utf8");

console.log(`Press a key
  w to watch a tree
  p to plant a tree
  s to switch to Sam
  j to switch to Julia
  q to quit
`);

process.stdin.on("data", (key: string) => {
  if (key === "p") {
    const sp: SeedsPlanter | null = selectSeedsPlanter();
    if (!sp) {
      return
    }

    sp.plantSeed()
  } else if (key === "w") {
    const tc: TreeContemplator | null = selectTreeContemplator();
    if (!tc) {
      return;
    }

    tc.watchTrees();
  } else if (key === "s") {
    console.log("Sam selected");
    samSelected = true;
    juliaSelected = false;
  } else if (key === "j") {
    console.log("Julia selected");
    samSelected = false;
    juliaSelected = true;
  } else if (key === "q" || key === "\u0003") {
    process.exit();
  }
});
