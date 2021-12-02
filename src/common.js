AFRAME.registerComponent("cursor-listener", {
  init: function () {
    this.el.addEventListener("raycaster-intersected", (evt) => {
      this.raycaster = evt.detail.el;
    });
    this.el.addEventListener("raycaster-intersected-cleared", (evt) => {
      this.raycaster = null;
    });
  },
  tick: function () {
    if (!this.raycaster) {
      return;
    }
    let intersection = this.raycaster.components.raycaster.getIntersection(
      this.el
    );
    if (!intersection) {
      return;
    } else if (intersection.object.el.getAttribute("id") == "price_box") {
      clearInterval(counter);
      var winner = document.getElementById("winner");
      var attr_text = winner.getAttribute("text");
      attr_text = "Hurray! You Win!";
      winner.setAttribute("text", attr_text);
    } else {
      init(width, height);
    }
  },
});

Array.prototype.repeat = function (what, L) {
  while (L) this[--L] = what;
  return this;
};
String.prototype.replaceArray = function (find, replace) {
  var replaceString = this;
  for (var i = 0; i < find.length; i++) {
    replaceString = replaceString.replace(find[i], replace[i]);
  }
  return replaceString;
};

var QueryString = (function () {
  var query_string = {};
  var query = window.location.hash.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
      query_string[pair[0]] = arr;
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return query_string;
})();

function cyph(str) {
  return str.replace();
}

function shuffle(a) {
  var j, x, i;
  for (i = a.length; i; i--) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
}

function buildPath(maze, pos) {
  var neighbor = [];
  maze[pos[0]][pos[1]] = 1;
  if (pos[0] > 0) neighbor.push([pos[0] - 1, pos[1]]);
  if (pos[1] > 0) neighbor.push([pos[0], pos[1] - 1]);
  if (pos[0] < maze.length - 1) neighbor.push([pos[0] + 1, pos[1]]);
  if (pos[1] < maze[0].length - 1) neighbor.push([pos[0], pos[1] + 1]);

  shuffle(neighbor);

  for (var i = neighbor.length - 1; i >= 0; i--) {
    if (
      maze[neighbor[i][0]][neighbor[i][1]] == 0 &&
      countNeighbors(maze, neighbor[i]) == 1
    ) {
      buildPath(maze, neighbor[i]);
    }
  }
}

function countNeighbors(maze, pos) {
  var res = 0;
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
  var res = [];
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
  var maze_height = maze.length;
  var maze_width = maze[0].length;

  var scene = document.getElementById("scene");

  var aplanes = document.getElementsByTagName("a-plane");
  for (var i = aplanes.length - 1; i >= 0; i--) {
    scene.remove(aplanes[i]);
  }
  var aboxes = document.getElementsByTagName("a-box");
  for (var i = aboxes.length - 1; i >= 0; i--) {
    scene.remove(aboxes[i]);
  }

  // GROUND
  var plane_ground = document.createElement("a-plane");
  plane_ground.setAttribute("static-body", "");
  plane_ground.setAttribute("height", 3 * maze_height);
  plane_ground.setAttribute("width", 3 * maze_width);
  plane_ground.setAttribute("position", "0 0 0");
  plane_ground.setAttribute("rotation", "90 0 0");
  plane_ground.setAttribute(
    "material",
    "src: #asset_ground;side: double;repeat: " + maze_width + " " + maze_height
  );
  scene.appendChild(plane_ground);

  // WALL
  var plane_wall = document.createElement("a-plane");
  plane_wall.setAttribute("static-body", "");
  plane_wall.setAttribute("height", 3);
  plane_wall.setAttribute("width", 3 * maze_width);
  plane_wall.setAttribute("position", "0 1.5 " + 3 * (maze_height * 0.5));
  plane_wall.setAttribute("rotation", "0 0 0");
  plane_wall.setAttribute(
    "material",
    "src: #asset_wall;side: double;repeat: " + maze_width + " 1"
  );
  scene.appendChild(plane_wall);
  plane_wall = document.createElement("a-plane");
  plane_wall.setAttribute("static-body", "");
  plane_wall.setAttribute("height", 3);
  plane_wall.setAttribute("width", 3 * maze_width);
  plane_wall.setAttribute("position", "0 1.5 -" + 3 * (maze_height * 0.5));
  plane_wall.setAttribute("rotation", "0 0 0");
  plane_wall.setAttribute(
    "material",
    "src: #asset_wall;side: double;repeat: " + maze_width + " 1"
  );
  scene.appendChild(plane_wall);
  plane_wall = document.createElement("a-plane");
  plane_wall.setAttribute("static-body", "");
  plane_wall.setAttribute("height", 3);
  plane_wall.setAttribute("width", 3 * maze_height);
  plane_wall.setAttribute("position", 3 * (maze_width * 0.5) + " 1.5 0");
  plane_wall.setAttribute("rotation", "0 90 0");
  plane_wall.setAttribute(
    "material",
    "src: #asset_wall;side: double;repeat: " + maze_height + " 1"
  );
  scene.appendChild(plane_wall);
  plane_wall = document.createElement("a-plane");
  plane_wall.setAttribute("static-body", "");
  plane_wall.setAttribute("height", 3);
  plane_wall.setAttribute("width", 3 * maze_height);
  plane_wall.setAttribute("position", -3 * (maze_width * 0.5) + " 1.5 0");
  plane_wall.setAttribute("rotation", "0 90 0");
  plane_wall.setAttribute(
    "material",
    "src: #asset_wall;side: double;repeat: " + maze_height + " 1"
  );
  scene.appendChild(plane_wall);

  var free1 = 0,
    free2 = 0;
  while (maze[free1][free2] != 1) {
    free1++;
    if (free1 >= maze_height) {
      free1 = 0;
      free2++;
    }
  }
  var cam = document.getElementById("camera");
  cam.setAttribute(
    "position",
    3 * (free2 - (maze_width - 1) * 0.5) +
      " 1.6 " +
      3 * (free1 - (maze_height - 1) * 0.5)
  );

  // INSTRUCTION
  var plane_instructions = document.createElement("a-box");
  plane_instructions.setAttribute("height", 1.5);
  plane_instructions.setAttribute("width", 2.5);
  plane_instructions.setAttribute("deepth", 2.5);
  plane_instructions.setAttribute("look-at", "#camera");
  plane_instructions.setAttribute("id", "instruction");
  plane_instructions.setAttribute("material", "src: #asset_instruction;");
  plane_instructions.setAttribute(
    "position",
    3 * (free2 - (maze_width - 1) * 0.5) +
      " 1 " +
      3 * (free1 - (maze_height - 1) * 0.5)
  );
  scene.appendChild(plane_instructions);

  // START_RELOADER
  var reloader = document.createElement("a-entity");
  reloader.setAttribute("id", "reloader");
  reloader.setAttribute("class", "cursor-listener");
  reloader.setAttribute("cursor-listener", "");
  reloader.setAttribute("gltf-model", "#asset_reload");
  reloader.setAttribute(
    "position",
    3 * (free2 - (maze_width - 1) * 0.5) +
      " 2 " +
      3 * (free1 - (maze_height - 1) * 0.5)
  );
  scene.appendChild(reloader);

  // ALTAR
  var altar = document.createElement("a-entity");
  altar.setAttribute("rotation", "0 90 0");
  altar.setAttribute("gltf-model", "#asset_altar");
  altar.setAttribute(
    "position",
    3 * (free2 - (maze_width - 1) * 0.5) +
      " 0 " +
      3 * (free1 - (maze_height - 1) * 0.5)
  );
  scene.appendChild(altar);

  var free1 = maze_height - 1,
    free2 = maze_width - 1;
  while (maze[free1][free2] != 1) {
    free1--;
    if (free1 <= 0) {
      free1 = maze_height - 1;
      free2--;
    }
  }

  // DOOR
  var price_box = document.createElement("a-entity");
  price_box.setAttribute("id", "price_box");
  price_box.setAttribute("class", "cursor-listener");
  price_box.setAttribute("cursor-listener", "");
  price_box.setAttribute("rotation", "0 180 0");
  price_box.setAttribute("gltf-model", "#asset_price");
  price_box.setAttribute("scale", "1.2 1.2 1.2");
  price_box.setAttribute(
    "position",
    3 * (free2 - (maze_width - 1) * 0.5) +
      " 0 " +
      3 * (free1 - (maze_height - 1) * 0.5)
  );
  scene.appendChild(price_box);

  // FINISH_RELOADER
  var reloader = document.createElement("a-entity");
  reloader.setAttribute("id", "reloader");
  reloader.setAttribute("class", "cursor-listener");
  reloader.setAttribute("rotation", "0 180 0");
  reloader.setAttribute("cursor-listener", "");
  reloader.setAttribute("gltf-model", "#asset_reload");
  reloader.setAttribute(
    "position",
    3 * (free2 - (maze_width - 1) * 0.5) +
      " 0.8 " +
      (3 * (free1 - (maze_height - 1) * 0.5) + 0.8)
  );
  scene.appendChild(reloader);

  // BOX WALL
  for (var i = 0; i < maze_height; i++) {
    for (var j = 0; j < maze_width; j++) {
      if (maze[i][j] == 1) {
        continue;
      }
      var box_wall = document.createElement("a-box");
      box_wall.setAttribute("static-body", "");
      // box_wall.setAttribute(
      //   "camera-cube-env",
      //   "distance: 5000; resolution: 512; repeat: true; interval: 50;metalness:1;roughness:0"
      // );
      box_wall.setAttribute("height", 3);
      box_wall.setAttribute("width", 3);
      box_wall.setAttribute("depth", 3);
      box_wall.setAttribute(
        "position",
        3 * (j - (maze_width - 1) * 0.5) +
          " 1.5 " +
          3 * (i - (maze_height - 1) * 0.5)
      );
      box_wall.setAttribute("color", "#fff");
      box_wall.setAttribute(
        "material",
        "src: #asset_wall; metalness: 0; roughness: 0.5;"
      );
      scene.appendChild(box_wall);
    }
  }
}
