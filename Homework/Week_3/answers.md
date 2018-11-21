# Name: Julien Fer
# Student number: 10649441
# This pdf file contains a few answers on questions asked in the assignment of week 3 of Dataprocessing.

1. Explain the difference between the == operator and the === operator:

 When comparing values of the same type using ==, the outcome is easy
 to predict: you should get true when both values are the same,
 except in the case of NaN. But when the types differ, JavaScript uses
 a complicated and confusing set of rules to determine what to do.
 In most cases, it just tries to convert one of the values to
 the other value’s type. However, when null or undefined occurs on
 either side of the operator, it produces true only
 if both sides are one of null or undefined.
 if you don't want type conversion to happen one can use the === operator. This
 test if the values are PRECISELY equal to each other.

2. Explain what a closure is. (Note that JavaScript programs use closures very often)

Being able to reference a specific instance of a local binding in an encolsing
scope is called closure.
So one could call a function and set the parameter(instance) equal to a specific value
and thus creates an environment in which the parameter is bound to that value.
This environment will be "remembered" in the variable in which it is stored. So
when this environment is called, it will execute the body with the parameter (instance)
equal to the value given by the user.

3. Explain what higher order functions are.

Higher order functions are functions that operate on other functions, either by
taking them as arguments or by returning them.

4. Explain what a query selector is and give an example line of JavaScript that uses a query selector.

The querySelector() is a method that returns the first element that matches a
specified CSS selector(s) in the document. An example of a command is document.querySelector("p");
This gets the first <p> element in the document.
