Array.prototype.repeat = function (what, L) {
  while (L) this[--L] = what;
  return this;
};

String.prototype.replaceArray = function (find, replace) {
  let replaceString = this;
  for (let i = 0; i < find.length; i++) {
    replaceString = replaceString.replace(find[i], replace[i]);
  }
  return replaceString;
};

let QueryString = (function () {
  let query_string = {};
  let query = window.location.hash.substring(1);
  let lets = query.split("&");
  for (let i = 0; i < lets.length; i++) {
    let pair = lets[i].split("=");
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
    } else if (typeof query_string[pair[0]] === "string") {
      let arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
      query_string[pair[0]] = arr;
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
})();

function shuffle(a) {
  let j, x, i;
  for (i = a.length; i; i--) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
}

function buildPath(maze, pos) {
  let neighbor = [];
  maze[pos[0]][pos[1]] = 1;
  if (pos[0] > 0) neighbor.push([pos[0] - 1, pos[1]]);
  if (pos[1] > 0) neighbor.push([pos[0], pos[1] - 1]);
  if (pos[0] < maze.length - 1) neighbor.push([pos[0] + 1, pos[1]]);
  if (pos[1] < maze[0].length - 1) neighbor.push([pos[0], pos[1] + 1]);

  shuffle(neighbor);

  for (let i = neighbor.length - 1; i >= 0; i--) {
    if (
      maze[neighbor[i][0]][neighbor[i][1]] == 0 &&
      countNeighbors(maze, neighbor[i]) == 1
    ) {
      buildPath(maze, neighbor[i]);
    }
  }
}

function countNeighbors(maze, pos) {
  let res = 0;
  if (pos[0] > 0 && maze[pos[0] - 1][pos[1]] == 1) {
    res++;
  }
  if (pos[1] > 0 && maze[pos[0]][pos[1] - 1] == 1) {
    res++;
  }
  if (pos[0] < maze.length - 1 && maze[pos[0] + 1][pos[1]] == 1) {
    res++;
  }
  if (pos[1] < maze[0].length - 1 && maze[pos[0]][pos[1] + 1] == 1) {
    res++;
  }
  return res;
}

function lookNeighbors(maze, pos, look) {
  let res = [];
  if (look != 270 && pos[0] > 0 && maze[pos[0] - 1][pos[1]] == 1) {
    res.push([pos[0] - 1, pos[1]]);
  }
  if (look != 180 && pos[1] > 0 && maze[pos[0]][pos[1] - 1] == 1) {
    res.push([pos[0], pos[1] - 1]);
  }
  if (look != 90 && pos[0] < maze.length - 1 && maze[pos[0] + 1][pos[1]] == 1) {
    res.push([pos[0] + 1, pos[1]]);
  }
  if (
    look != 0 &&
    pos[1] < maze[0].length - 1 &&
    maze[pos[0]][pos[1] + 1] == 1
  ) {
    res.push([pos[0], pos[1] + 1]);
  }
  shuffle(res);
  return res;
}

function paintMaze(maze) {
  let maze_height = maze.length;
  let maze_width = maze[0].length;
  let scene = document.getElementById("scene");

  let aplanes = document.getElementsByTagName("a-plane");
  for (let i = aplanes.length - 1; i >= 0; i--) {
    scene.remove(aplanes[i]);
  }
  let aboxes = document.getElementsByTagName("a-box");
  for (let i = aboxes.length - 1; i >= 0; i--) {
    scene.remove(aboxes[i]);
  }

  let ground = document.createElement("a-plane");
  ground.setAttribute("static-body", "");
  ground.setAttribute("height", 3 * maze_height);
  ground.setAttribute("width", 3 * maze_width);
  ground.setAttribute("position", "0 0 0");
  ground.setAttribute("rotation", "90 0 0");
  ground.setAttribute(
    "material",
    "src: #asset_ground;side: double;repeat: " + maze_width + " " + maze_height
  );
  scene.appendChild(ground);

  let wall = document.createElement("a-plane");
  wall.setAttribute("static-body", "");
  wall.setAttribute("height", 3);
  wall.setAttribute("width", 3 * maze_width);
  wall.setAttribute("position", "0 1.5 " + 3 * (maze_height * 0.5));
  wall.setAttribute("rotation", "0 0 0");
  wall.setAttribute(
    "material",
    "src: #asset_wall;side: double;repeat: " + maze_width + " 1"
  );
  scene.appendChild(wall);
  wall = document.createElement("a-plane");
  wall.setAttribute("static-body", "");
  wall.setAttribute("height", 3);
  wall.setAttribute("width", 3 * maze_width);
  wall.setAttribute("position", "0 1.5 -" + 3 * (maze_height * 0.5));
  wall.setAttribute("rotation", "0 0 0");
  wall.setAttribute(
    "material",
    "src: #asset_wall;side: double;repeat: " + maze_width + " 1"
  );
  scene.appendChild(wall);
  wall = document.createElement("a-plane");
  wall.setAttribute("static-body", "");
  wall.setAttribute("height", 3);
  wall.setAttribute("width", 3 * maze_height);
  wall.setAttribute("position", 3 * (maze_width * 0.5) + " 1.5 0");
  wall.setAttribute("rotation", "0 90 0");
  wall.setAttribute(
    "material",
    "src: #asset_wall;side: double;repeat: " + maze_height + " 1"
  );
  scene.appendChild(wall);
  wall = document.createElement("a-plane");
  wall.setAttribute("static-body", "");
  wall.setAttribute("height", 3);
  wall.setAttribute("width", 3 * maze_height);
  wall.setAttribute("position", -3 * (maze_width * 0.5) + " 1.5 0");
  wall.setAttribute("rotation", "0 90 0");
  wall.setAttribute(
    "material",
    "src: #asset_wall;side: double;repeat: " + maze_height + " 1"
  );
  scene.appendChild(wall);

  let free1 = 0;
  let free2 = 0;
  while (maze[free1][free2] != 1) {
    free1++;
    if (free1 >= maze_height) {
      free1 = 0;
      free2++;
    }
  }
  let cam = document.getElementById("camera");
  cam.setAttribute(
    "position",
    3 * (free2 - (maze_width - 1) * 0.5) +
      " 1.6 " +
      3 * (free1 - (maze_height - 1) * 0.5)
  );

  let instruction = document.createElement("a-box");
  instruction.setAttribute("height", 2.2);
  instruction.setAttribute("width", 1.34);
  instruction.setAttribute("deepth", 1.34);
  instruction.setAttribute("look-at", "#camera");
  instruction.setAttribute("id", "instruction");
  instruction.setAttribute("material", "src: #asset_instruction;");
  instruction.setAttribute(
    "position",
    3 * (free2 - (maze_width - 1) * 0.5) +
      " 1 " +
      3 * (free1 - (maze_height - 1) * 0.5)
  );
  scene.appendChild(instruction);

  let reloader_start = document.createElement("a-entity");
  reloader_start.setAttribute("id", "reloader");
  reloader_start.setAttribute("class", "cursor-listener");
  reloader_start.setAttribute("cursor-listener", "");
  reloader_start.setAttribute("gltf-model", "#asset_reload");
  reloader_start.setAttribute(
    "position",
    3 * (free2 - (maze_width - 1) * 0.5) +
      " 2 " +
      3 * (free1 - (maze_height - 1) * 0.5)
  );
  scene.appendChild(reloader_start);

  let altar = document.createElement("a-entity");
  altar.setAttribute("rotation", "0 90 0");
  altar.setAttribute("gltf-model", "#asset_altar");
  altar.setAttribute(
    "position",
    3 * (free2 - (maze_width - 1) * 0.5) +
      " 0 " +
      3 * (free1 - (maze_height - 1) * 0.5)
  );
  scene.appendChild(altar);

  free1 = maze_height - 1;
  free2 = maze_width - 1;
  while (maze[free1][free2] != 1) {
    free1--;
    if (free1 <= 0) {
      free1 = maze_height - 1;
      free2--;
    }
  }

  let door = document.createElement("a-entity");
  door.setAttribute("id", "door");
  door.setAttribute("class", "cursor-listener");
  door.setAttribute("cursor-listener", "");
  door.setAttribute("rotation", "0 180 0");
  door.setAttribute("gltf-model", "#asset_price");
  door.setAttribute("scale", "1.2 1.2 1.2");
  door.setAttribute(
    "position",
    3 * (free2 - (maze_width - 1) * 0.5) +
      " 0 " +
      3 * (free1 - (maze_height - 1) * 0.5)
  );
  scene.appendChild(door);

  let completed = document.createElement("a-plane");
  completed.setAttribute("id", "completed");
  completed.setAttribute("height", 1.22);
  completed.setAttribute("width", 0.91);
  completed.setAttribute("rotation", "0 180 0");
  completed.setAttribute(
    "material",
    "src: #asset_completed; side: double; visible: false;"
  );
  completed.setAttribute(
    "position",
    3 * (free2 - (maze_width - 1) * 0.5) +
      " 1 " +
      (3 * (free1 - (maze_height - 1) * 0.5) - 0.6)
  );
  scene.appendChild(completed);

  let reloader_finish = document.createElement("a-entity");
  reloader_finish.setAttribute("id", "reloader_finish");
  reloader_finish.setAttribute("class", "cursor-listener");
  reloader_finish.setAttribute("rotation", "0 180 0");
  reloader_finish.setAttribute("cursor-listener", "");
  reloader_finish.setAttribute("gltf-model", "#asset_reload");
  reloader_finish.setAttribute("visible", "false");
  reloader_finish.setAttribute(
    "position",
    3 * (free2 - (maze_width - 1) * 0.5) +
      " 0.8 " +
      (3 * (free1 - (maze_height - 1) * 0.5) + 0.8)
  );
  scene.appendChild(reloader_finish);

  for (let i = 0; i < maze_height; i++) {
    for (let j = 0; j < maze_width; j++) {
      if (maze[i][j] == 1) {
        continue;
      }
      let wall = document.createElement("a-box");
      wall.setAttribute("static-body", "");
      // wall.setAttribute(
      //   "camera-cube-env",
      //   "distance: 5000; resolution: 512; repeat: true; interval: 50;metalness:1;roughness:0"
      // );
      wall.setAttribute("height", 3);
      wall.setAttribute("width", 3);
      wall.setAttribute("depth", 3);
      wall.setAttribute(
        "position",
        3 * (j - (maze_width - 1) * 0.5) +
          " 1.5 " +
          3 * (i - (maze_height - 1) * 0.5)
      );
      wall.setAttribute("color", "#fff");
      wall.setAttribute(
        "material",
        "src: #asset_wall; metalness: 0; roughness: 0.5;"
      );
      scene.appendChild(wall);
    }
  }
}
