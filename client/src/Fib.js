import React, { Component } from "react";
import axios from "axios";

class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: ""
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  async fetchValues() {
    const values = await axios.get("/api/values/current");
    if (!!values.data && values.data[0] === "<") return;
    this.setState({ values: values.data });
  }
  async fetchIndexes() {
    const seenIndexes = await axios.get("/api/values/all");
    if (seenIndexes.data && seenIndexes.data.includes("<!")) return;
    this.setState({
      seenIndexes: seenIndexes.data
    });
  }

  handleSubmit = async event => {
    event.preventDefault();
    await axios.post("/api/values", {
      index: this.state.index
    });
    this.setState({ index: "" });
    this.fetchIndexes();
    this.fetchValues();
  };

  clearData = async event => {
    const result = await axios.get("/api/values/clear");
    if (result.data) {
      this.setState({
        seenIndexes: [],
        values: {}
      });
    }
  };
  renderSeenIndexes() {
    return this.state.seenIndexes.map(({ number }) => number).join(", ");
  }

  renderValues() {
    const entries = [];
    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {this.state.values[key]}
        </div>
      );
    }
    return entries;
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="">Enter your index:</label>
          <input
            type="text"
            value={this.state.index}
            onChange={event => this.setState({ index: event.target.value })}
          />
          <button>Submit</button>
        </form>

        <h3>Indexes I have seen</h3>
        {this.renderSeenIndexes()}
        <h3>Calculated Values:</h3>
        {this.renderValues()}
        <hr />
        <div>
          <button onClick={this.clearData}>Clear</button>
        </div>
      </div>
    );
  }
}

export default Fib;
