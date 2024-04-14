package main

import (
	"html/template"
	"log"
	"net/http"
	"time"
)

type TimePageVariables struct {
	Date string
	Time string
}

type ButtonPageVariables struct {
	PageTitle        string
	PageRadioButtons []RadioButton
	Answer           string
}

type RadioButton struct {
	Name       string
	Value      string
	IsDisabled bool
	IsChecked  bool
	Text       string
}

func main() {
	// http.HandleFunc("/", HomePage)
	http.HandleFunc("/", DisplayRadioButtons)
	http.HandleFunc("/selected", UserSelected)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func HomePage(w http.ResponseWriter, r *http.Request) {
	now := time.Now()
	HomePageVars := TimePageVariables{
		Date: now.Format("02-01-2006"),
		Time: now.Format("15:04:05"),
	}

	// Parsing the html file I'd put here.
	homePageTemplate, err := template.ParseFiles("homepage.html")
	if err != nil {
		log.Println("template parsing error: ", err)
	}
	err = homePageTemplate.Execute(w, HomePageVars)
	if err != nil {
		log.Println("template execution error: ", err)
	}
}

func DisplayRadioButtons(w http.ResponseWriter, r *http.Request) {
	Title := "Which do you prefer?"
	MyRadioButtons := []RadioButton{
		{"animalselect", "cats", false, false, "Cats"},
		{"animalselect", "dogs", false, false, "Dogs"},
	}

	MyPageVariables := ButtonPageVariables{
		PageTitle:        Title,
		PageRadioButtons: MyRadioButtons,
	}

	MyTemplate, err := template.ParseFiles("select.html")
	if err != nil {
		log.Println("template parsing error: ", err)
	}

	err = MyTemplate.Execute(w, MyPageVariables)
	if err != nil {
		log.Println("template excution error: ", err)
	}
}

func UserSelected(w http.ResponseWriter, r *http.Request) {
	r.ParseForm() /* r.Form is now either map[animalselect:[cats]]
	or map[animalselect:[dogs]]. The next line is for getting the
	animal which has been selected. */
	yourAnimal := r.Form.Get("animalselect")

	Title := "Your preffered animal"
	MyPageVariables := ButtonPageVariables{
		PageTitle: Title,
		Answer:    yourAnimal,
	}

	// Generating a template by passing in page variables.
	MyTemplate, err := template.ParseFiles("select.html")
	if err != nil {
		log.Println("template parsing error: ", err)
	}

	err = MyTemplate.Execute(w, MyPageVariables)
	if err != nil {
		log.Println("template execution error: ", err)
	}
}
