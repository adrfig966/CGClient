import React from "react";
import axios from "axios";
class SearchForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      coinlist: [],
      suggestions: [],
      searchquery: "",
      daysback: 5
    };
    this.suggestionClick = this.suggestionClick.bind(this);
    this.suggestionHover = this.suggestionHover.bind(this);
    this.generateSuggestion = this.generateSuggestion.bind(this);
    this.daysInput = this.daysInput.bind(this);
    this.btnClick = this.btnClick.bind(this);
    this.redirectEnter = this.redirectEnter.bind(this);
    this.clearSuggestions = this.clearSuggestions.bind(this);
    this.radioClick = this.radioClick.bind(this);
  }
  componentDidMount() {
    axios.get("https://api.coingecko.com/api/v3/coins/list").then(res => {
      this.setState({ coinlist: res.data });
    });
  }
  componentDidUpdate() {}
  generateSuggestion(e) {
    var newSuggestions;
    newSuggestions = this.state.coinlist.filter(coin => {
      return coin.name.toLowerCase().startsWith(e.target.value.toLowerCase());
    });
    if (e.target.value == "") {
      newSuggestions = [];
    }
    this.setState({ searchquery: e.target.value, suggestions: newSuggestions });
  }
  daysInput(e) {
    this.setState({ daysback: e.target.value });
  }
  suggestionClick(e) {
    this.setState({ suggestions: [] });
    var querydata = {
      id: e.target.id,
      name: e.target.innerText,
      daysback: this.state.daysback
    };
    this.props.suggestionClick(querydata);
  }
  btnClick() {
    console.log(this.state.searchquery);
    var result;
    this.state.coinlist.forEach((coin, index) => {
      if (
        coin.name
          .toLowerCase()
          .startsWith(this.state.searchquery.toLowerCase()) &&
        !result
      ) {
        result = index;
      }
    });
    if (!result) {
      return;
    }
    var querydata = {
      id: this.state.coinlist[result].id,
      name: this.state.coinlist[result].name,
      daysback: this.state.daysback
    };
    console.log(querydata);
    this.setState({ suggestions: [] });
    this.props.suggestionClick(querydata);
  }
  redirectEnter(e) {
    if (e.key == "Enter") {
      this.btnClick();
    }
  }
  suggestionHover(e) {
    this.setState({ searchquery: e.target.innerText });
  }
  clearSuggestions() {
    setTimeout(() => {
      this.setState({ suggestions: [] });
    }, 500);
  }
  radioClick(e) {
    this.props.dataOptions(e);
  }
  render() {
    return (
      <div className="search-form">
        <div className="suggestions-box">
          {this.state.suggestions.map(suggestion => {
            return (
              <div
                className="suggestion"
                onClick={this.suggestionClick}
                onMouseEnter={this.suggestionHover}
                key={suggestion.id}
                id={suggestion.id}
              >
                {suggestion.name}
              </div>
            );
          })}
        </div>
        <input className="downarrow" type="button" value=">" />
        <input
          className="search-input"
          type="text"
          placeholder="Enter Crypto"
          autoFocus
          autoComplete="off"
          onInput={this.generateSuggestion}
          value={this.state.searchquery}
          onKeyPress={this.redirectEnter}
          onBlur={this.clearSuggestions}
        />
        <input
          className="days-input"
          type="number"
          placeholder="Days back"
          autoFocus
          autoComplete="off"
          onInput={this.daysInput}
          value={this.state.daysback}
        />
        <input
          className="search-button"
          onClick={this.btnClick}
          type="button"
          value="Get history"
        />
        <br />
        <input
          type="radio"
          value="prices"
          checked={this.props.datadisplay == "prices"}
          onChange={this.radioClick}
        />{" "}
        Prices (USD)
        <input
          type="radio"
          value="market_caps"
          checked={this.props.datadisplay == "market_caps"}
          onChange={this.radioClick}
        />{" "}
        Market Caps
        <input
          type="radio"
          value="total_volumes"
          checked={this.props.datadisplay == "total_volumes"}
          onChange={this.radioClick}
        />{" "}
        Volumes
      </div>
    );
  }
}
//<input className="search-button" type="button" value="Get history" />
export default SearchForm;
