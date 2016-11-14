import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.css']
})
export class PlaygroundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  now = new Date;
  messages = [{
    timestamp: this.now.toLocaleString(),
    text: "Test"
  }];
  text = 'Test';
  sendMessage() {
    let date = new Date;
    let message = { timestamp: date.toLocaleString(),
                    text: this.text
    };
    this.messages.push(message);
  }

}
