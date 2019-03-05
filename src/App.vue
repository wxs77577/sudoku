<template>
  <div>
    <h5>{{isSuccess}}</h5>

    <table>
      <tr>
        <td></td>
        <td v-for="m in len" :key="m">{{m}}</td>
      </tr>
      <tr v-for="m in len" :key="m">
        <td>{{m}}</td>
        <td v-for="n in len" :key="`${m}-${n}`">
          <input
            type="text"
            @focus="onFocus(m-1, n-1)"
            @input="onInput(m-1, n-1, arguments[0])"
            :value="data[m-1][n-1]"
            v-if="data[m-1]"
            maxlength="1"
          >
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      len: 0,
      data: [],
      isSuccess: false
    };
  },
  watch: {
    len: "initData"
  },
  methods: {
    onFocus(e) {},
    initData() {
      for (let x = 0; x < this.len; x++) {
        const row = [];
        for (let y = 0; y < this.len; y++) {
          row.push(null);
        }
        this.$set(this.data, x, row);
      }
    },
    onInput(x, y, e) {
      this.$set(this.data[x], y, e.data);
      this.check();
    },
    check() {
      // check rows
      for (let i = 0; i < this.len; i++) {
        this.isSuccess = this.validate(this.data[i]);
        if (!this.isSuccess) {
          console.log(`第${i + 1}行有误`);
          return false;
        }
      }
      // check columns
      for (let i = 0; i < this.len; i++) {
        const row = [];
        for (let j = 0; j < this.len; j++) {
          row.push(this.data[j][i]);
        }
        this.isSuccess = this.validate(row);
        if (!this.isSuccess) {
          console.log(`第${i + 1}列有误`);
          return false;
        }
      }
      // check 9-cell
      if (len === 9) {
        for (let i = 0; i < 3; i++) {
          const row = [];
          for (let j = 0; j < this.len; j++) {
            row.push(this.data[j][i]);
          }
          this.isSuccess = this.validate(row);
          if (!this.isSuccess) {
            console.log(`第${i + 1}个九宫格有误`);
            return false;
          }
        }
      }
      this.isSuccess = true;
    },
    validate(row) {
      return new Set(row).size === row.length;
    }
  },
  created() {
    this.len = 2;
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}
table {
  border-collapse: collapse;
}
table,
td,
th {
  border: 1px solid #ccc;
  text-align: center;
  vertical-align: middle;
  padding: 0;
}
td {
  width: 3rem;
  height: 3rem;
}
td input {
  display: block;
  width: 100%;
  height: 100%;
  font-size: 1.5rem;
  text-align: center;
  outline: none;
}
</style>

