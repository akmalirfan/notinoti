import React from "react";
import JsBarcode from 'jsbarcode';

export class NotificationBuilder extends React.Component {
    constructor(props) {
        super(props);

        // ES6 class properties
        this.imageFilePicker = null;

        this.state = {
            title: "",
            body: "",
            barcode: "",
            barcodeImage: null,
        };
    }

    componentDidMount() {
        Notification.requestPermission();
    }

    handleTitle = (e) => {
        const newTitle = e.target.value;
        this.setState({
            title: newTitle
        });
    }

    handleBody = (e) => {
        const newBody = e.target.value;
        this.setState({
            body: newBody
        });
    }

    handleBarcode = (e) => {
        const newBarcode = e.target.value;
        this.setState({
            barcode: newBarcode,
            barcodeImage: this.barcodeToBase64Image(newBarcode)
        });
    }

    barcodeToBase64Image = (barcode) => {
        let canvas = document.createElement("canvas");
        JsBarcode(canvas, barcode, {format: "CODE39"});
        return canvas.toDataURL("image/png");
    }

    setImageFilePickerRef = (el) => {
        this.imageFilePicker = el;
    }

    getDataURL = () => {
        const input = this.imageFilePicker;

        if (input.files && input.files[0]) {
            let reader = new FileReader();

            reader.onload = (e) => {
                this.setState({
                    barcodeImage: e.target.result
                });
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    triggerNotification = () => {
        console.log("Test");
        navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(
                this.state.title,
                {
                    body: this.state.body,
                    image: this.state.barcodeImage,
                }
            )
        });
    }

    render() {
        return (
            <div className="notification-builder">
                <img id="barcode-image" src={this.state.barcodeImage} alt="" />

                <input type="text" onChange={this.handleTitle} placeholder="Notification title"/>
                <input type="text" onChange={this.handleBody} placeholder="Notification body"/>

                <input type="text" onChange={this.handleBarcode} placeholder="CODE128 barcode" />

                <input type="file" ref={this.setImageFilePickerRef} onChange={this.getDataURL} />

                <input type="button" onClick={this.triggerNotification} value="Show notification" />
            </div>
        );
    }
}