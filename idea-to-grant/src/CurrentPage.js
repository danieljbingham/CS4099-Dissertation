import React, { Component } from 'react'
import './CurrentPage.css'
import ItemService from './item-service'

class CurrentPage extends Component {
    constructor(props) {
        super(props);
        this.itemService = new ItemService();
        this.addToShortlist = this.addToShortlist.bind(this);
        this.state = {
            showDetails: false,
        }
    }

    render() {

        return (
            <div className="currentPage">
                <h1>Research Opportunity | research.com</h1>
                <textarea>Make some notes about this project here...</textarea>

                <h1>Information about research agency</h1>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fringilla quam ac suscipit mattis. Quisque nec placerat quam.
                Aenean efficitur metus vitae lacus aliquet, at consequat erat pulvinar.
                Integer non arcu sit amet nisl egestas mollis...</p>

                <h1>Resources</h1>
                <select name="Cars" size="3">
                    <option value="file1.pdf"> file1.pdf </option>
                    <option value="file2.doc"> file2.doc </option>
                    <option value="file3.jpeg"> file3.jpeg </option>
                </select>
                <button type="button">Upload files for this opportunity</button>

                <h1>Time until application deadline</h1>
                <progress id="deadline" value="32" max="100" />

                {/*<div className="currentPage__addToShortlist">
                <input type="checkbox" id="chkShortlist" name="shortlist" value="add" />
                <label for="chkShortlist"> Add this opportunity to shortlist</label>
            </div>*/}

                <button type="button" onClick={this.addToShortlist}>Add this opportunity to my shortlist</button>

            </div>
        )
    }

    addToShortlist() {
        // send to api
        // remove button
        /*var tosend = {
            "user":"http://localhost:8080/api/users/1",
            "opportunity":"http://localhost:8080/api/opportunities/4"
        }*/
        var tosend = "http://localhost:8080/api/users/1 http://localhost:8080/api/opportunities/4"
        this.itemService.createItem(tosend);
    }
}

export default CurrentPage
