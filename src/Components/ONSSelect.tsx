import React, {ChangeEvent, Component} from "react";
import "./ONSSelect.css";

interface Props{
  label?: string
  id?: string
  onChange? : (e: ChangeEvent<HTMLSelectElement>, ...args: any[]) => void
  value: string
  options: Option[]
  horizontal?: boolean
  small?: boolean
  defaultValue?: string
  disabled?: boolean
}

interface Option{
  label:string
  value?:string
  id?: string
}

interface State{
  value: string
}

export class ONSSelect extends Component <Props, State>{
  value: string = this.props.value !== undefined ? this.props.value : "";
  constructor(props : Props) {
    super(props);
    this.state = {value: props.value !== undefined ? this.props.value : ""};
  }

  handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if(this.props.onChange !== undefined){
      this.props.onChange(e);
    }
    this.value = e.target.value;
    this.setState({value: e.target.value});
  };

  defaultValue(): string {
    if(this.props.defaultValue) return this.props.defaultValue;
    return "";
  }

  horizontalOrVertical(): string {
    if(this.props.horizontal === true) return "horizontal smalll";
    return "";
  }

  render() {
    const divClassName = (this.props.horizontal? "horizontal " : " ") + (this.props.small && "small "); 
    const selectClassName = "input " + (this.props.disabled && "disabled ");

    return (
      <div className={divClassName}>
        {this.props.label !== undefined &&
          <label className="label" htmlFor={this.props.id}>{this.props.label} </label>
        }
        <select id={this.props.id} name="select" defaultValue={this.defaultValue()} className={selectClassName} onChange={(e) => this.handleChange(e)} disabled={this.props.disabled}>
          <option value="" disabled data-testid={"select-" + this.props.id}>
            Select an option
          </option>
          {this.props.options.map((option, index) =>
            <option value={option.value} key={index} id={option.id} data-testid={"option-" + this.props.id + "-" + option.value}>
              {option.label} 
            </option> 
          )}
        </select>
      </div>
    );
  }
}
