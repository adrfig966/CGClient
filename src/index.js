import React from "react";
import ReactDOM from "react-dom";
import SearchForm from "./searchform";
import axios from "axios";
import Chart from "chart.js";
import moment from "moment";
import "./styles.css";
var zoomstyle = {
  marginLeft: "10px",
  width: "10%",
  fontSize: "20px",
  borderTopLeftRadius: "10px",
  borderTopRightRadius: "10px",
  fontWeight: "900"
};
class App extends React.Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
    this.chartAreaRef = React.createRef();
    this.state = {
      chartinfo: {},
      chartvis: "block",
      zoomamount: 0,
      datadisplay: "prices",
      resdata: {}
    };
    this.suggestionClick = this.suggestionClick.bind(this);
    this.zoomIn = this.zoomIn.bind(this);
    this.zoomOut = this.zoomOut.bind(this);
    this.responseHandler = this.responseHandler.bind(this);
    this.radioClick = this.radioClick.bind(this);
  }
  componentDidMount() {
    const ctx = this.chartRef.current.getContext("2d");
    this.chart = new Chart(ctx, {
      // The type of chart we want to create
      type: "line",
      // The data for our dataset
      data: {
        labels: [],
        datasets: [
          {
            label: "Waiting for you to search...",
            backgroundColor: "#D6E5E3",
            borderColor: "#92BCEA",
            data: []
          }
        ]
      },
      options: {
        maintainAspectRatio: false
      }
    });
  }
  radioClick(e) {
    this.setState({ datadisplay: e.target.value });
    if (this.state.resdata.prices) {
    }
  }
  componentDidUpdate() {
    this.chartAreaRef.current.style.width = 100 + this.state.zoomamount + "%";
    if (this.state.resdata.prices) {
      var data = [],
        labels = [];
      this.state.resdata[this.state.datadisplay].forEach(datapoint => {
        data.push(datapoint[1]);
        labels.push(moment.utc(datapoint[0]).format("YYYY MM DD @ hA"));
      });
      this.chart.data.datasets[0].data = data;
      this.chart.data.datasets[0].label = `${this.state.datadisplay} of ${
        this.state.chartinfo.name
      } for previous ${this.state.chartinfo.daysback} day(s)`;
      this.chart.data.labels = labels;
      this.chart.update();
    }
  }
  responseHandler(res) {
    console.log("Response data: ");
    console.log(res.data);
    //Insert options here
    var targetdata = this.state.datadisplay;
    var data = [],
      labels = [];
    res.data[targetdata].forEach(datapoint => {
      data.push(datapoint[1]);
      labels.push(moment.utc(datapoint[0]).format("YYYY MM DD @ hA"));
    });

    var coinname = this.state.chartinfo.name;
    var daysback = this.state.chartinfo.daysback;
    this.chart.data.datasets[0].label = `Price of ${coinname} for previous ${daysback |
      "1"} day(s)`;
    this.chart.data.datasets[0].data = data;
    this.chart.data.labels = labels;
    this.setState({ resdata: res.data });
    this.chart.update();
  }
  suggestionClick(querydata) {
    console.log("Received in parent: ");
    console.log(querydata);
    axios
      .get(
        `https://api.coingecko.com/api/v3/coins/${
          querydata.id
        }/market_chart?vs_currency=usd&days=${querydata.daysback}`
      )
      .then(this.responseHandler);
    this.setState({ chartinfo: querydata });
  }
  zoomOut(e) {
    if (this.state.zoomamount < 0) {
      return;
    }
    this.setState({ zoomamount: this.state.zoomamount - 10 });
  }
  zoomIn(e) {
    if (this.state.zoomamount > 300) {
      return;
    }
    this.setState({ zoomamount: this.state.zoomamount + 10 });
  }
  render() {
    return (
      <div className="content-container">
        <SearchForm
          suggestionClick={this.suggestionClick}
          datadisplay={this.state.datadisplay}
          dataOptions={this.radioClick}
        />
        <div className="chartWrapper" style={{ display: this.state.chartvis }}>
          <div className="chartArea" ref={this.chartAreaRef}>
            <canvas id="mainChart" ref={this.chartRef} />
          </div>
        </div>
        <input
          type="button"
          onClick={this.zoomOut}
          value="-"
          style={zoomstyle}
        />
        <input
          type="button"
          onClick={this.zoomIn}
          value="+"
          style={zoomstyle}
        />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
