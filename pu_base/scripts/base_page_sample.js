/**
 * SAMPLE CODE
 * 
 * This example shows how to register a mvc box with the mvcid "base_page_sample" on the frontend controller
 * All dom nodes inside this box with an "data-mvcswitcher" attribute will automaticly have listeners to interact with the backend
 */

smdQS().ready(function ()
{
	var base_page_trail = mvc2frontendController.initMvcObject("base_page_sample");

	base_page_trail.postProcess = function (mvcObject, childObject, postObject, returnValue, event)
	{
		console.log("mvcObject:");
		console.dir(mvcObject);
		console.log("childObject:");
		console.dir(childObject);
		console.log("postObject:");
		console.dir(postObject);
		console.log("returnValue/object:");
		console.dir(JSON.parse(returnValue));
	};

	/*
		mvc2frontendController.addListener(base_page_trail, "input[name='username']", "blur", function ()
		{
			//some javascript code

			return true;
		});
	*/
});