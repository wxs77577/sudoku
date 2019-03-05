<template>
  <div class="p-3">
    <div class="nav nav-pills justify-content-center">
      <div
        class="nav-link"
        :class="{active: currentLevel == key}"
        v-for="(name, key) in levels"
        :key="key"
        @click="changeLevel(key)"
      >{{name}}</div>
    </div>
    <div class="box mt-3">
      <table>
        <tr v-for="m in 9" :key="m">
          <td
            v-for="n in 9"
            :key="`${m}-${n}`"
            :class="getClasses(m, n)"
            @click="currentIndex = getIndex(m, n)"
          >{{data[getIndex(m, n)]}}</td>
        </tr>
      </table>
    </div>
    <div class="mt-3 d-flex justify-content-between">
      <button
        class="btn btn-secondary"
        :disabled="getIsDisabled(n)"
        v-for="n in 9"
        :key="n"
        type="button"
        @click="input(currentIndex, n)"
      >{{n}}</button>
    </div>
    <div class="mt-3 row">
      <div class="col-4">
        <div class="alert alert-warning text-center" v-if="time">{{time}}</div>
      </div>
      <div class="col-8">
        <div class="alert alert-danger text-center" v-if="wrongTimes">哟，错了{{wrongTimes}}次咯。</div>
      </div>
    </div>
    <div class="mt-3 text-center">
      <a href="https://github.com/wxs77577/sudoku">https://github.com/wxs77577/sudoku</a>
    </div>

    <!-- <div class="mt-3">
      <div class="alert alert-success" v-if="errors.length < 1">成功</div>
      <div class="alert alert-danger" v-else>有误</div>
    </div>-->
  </div>
</template>
<script>
import dayjs from "dayjs";
import sudoku from "./sudoku";

let timer = null;

export default {
  data() {
    return {
      data: [],
      raw: "",
      ret: "",
      errors: [],
      wrongTimes: 0,
      message: "",
      currentIndex: 0,
      currentLevel: 20,
      time: "",
      begin: new Date(),
      end: new Date(),
      levels: {
        60: "青铜",
        50: "黄金",
        40: "钻石",
        20: "王者"
      }
    };
  },
  methods: {
    getIsDisabled(n) {
      let times = 0;
      this.data.map(v => {
        if (v == n) {
          times++;
        }
      });
      return times >= 9;
    },
    changeLevel(key) {
      if (window.confirm("确定要重新开始吗？")) {
        this.currentLevel = key;
        this.init(true);
      }
    },
    getClasses(m, n) {
      const i = this.getIndex(m, n);
      const isSameColumn = this.currentIndex % 9 === n - 1;
      const isSameRow = parseInt(this.currentIndex / 9) === m - 1;
      const isSameNumber =
        this.data[i] && this.data[i] === this.data[this.currentIndex];
      const isBorder = m % 3 === 0 || n % 3 === 0;
      return {
        invalid: this.errors[i],
        active: this.currentIndex === i,
        same: isSameNumber,
        "border-r": n % 3 === 0,
        "border-b": m % 3 === 0
        // highlight: isSameColumn || isSameRow,
      };
    },
    getIndex(m, n) {
      return (m - 1) * 9 + n - 1;
    },
    initRaw() {
      this.raw = sudoku.generate(parseInt(this.currentLevel));
    },
    init(force = false) {
      if (force) {
        this.initRaw();
      }
      this.ret = sudoku.solve(this.raw);
      this.data = this.raw.split("").map(v => (v === "." ? "" : v));
      this.setupTimer();
    },
    input(i, value) {
      if (!value) {
        return;
      }
      const valid = this.check(i, value);
      this.$set(this.errors, i, !valid);
      console.log(i, value, valid);
      this.$set(this.data, i, value);
    },
    check(i, value) {
      const valid = String(this.ret[i]) === String(value);
      if (!valid) {
        this.wrongTimes++;
      }
      return valid;
    },
    setupTimer() {
      timer = setInterval(() => {
        this.time = dayjs()
          .subtract(this.begin)
          .format("mm:ss");
      }, 1000);
    }
  },
  created() {
    this.init(true);

    window.onkeypress = e => {
      if (e.keyCode >= 48 && e.keyCode <= 57) {
        this.input(this.currentIndex, e.key);
      }
    };
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}
table {
  border-collapse: collapse;
  border: 3px solid #ccc;
  width: 90vw;
  height: 90vw;
}
td {
  width: 2rem;
  height: 2rem;
  border: 1px solid #ccc;
  text-align: center;
  vertical-align: middle;
}

td input {
  display: block;
  width: 100%;
  height: 100%;
  font-size: 1rem;
  text-align: center;
  outline: none;
  border: none;
  font-weight: bold;
}
td.invalid {
  background: #f99;
}
td.active {
  box-shadow: 0 0 7px rgba(253, 185, 0, 0.9);
}
td.highlight {
  background: rgba(253, 185, 0, 0.05);
}
td.same {
  background: rgba(253, 185, 0, 0.2);
}
td.border-r {
  border-right-width: 3px;
}
td.border-b {
  border-bottom-width: 3px;
}
</style>

