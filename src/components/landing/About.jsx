import React from 'react';
import '../../styles/About.css';

export default function About(){
    return(
        <div class="section">
		<div class="container">
			<div class="content-section">
				<div class="title">
					<h2>About Us</h2>
					<br></br>
				</div>
				<div class="content">
					<h2>Face Recogniton Attendance System</h2>

					<p>FRAS is an Attendance Marking Application wherein images from a live feed are verified for 
						liveliness using livliness detection and blinking detection. On successful verification the
						 image is passed through a convolutional neural network which will perform image
						 recognition on the image. Further the record will be saved and the attendance sheet 
						 can be downloaded.</p>
					<div class="button">
						<a href="https://docs.google.com/presentation/d/1hLLVvqaVCcmuW0OlWuHfk-2n93W0CP1AUo3Ub7ewWQg/edit#slide=id.p1">Read More</a>
					</div>
				</div>
				
			</div>
			<div class="image-section">
				{/* <img src="image/img one.jpg"> */}
			</div>
		</div>
	</div>

    )
}