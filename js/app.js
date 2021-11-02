let questions = [
    {
        'id': 1,
        'title': 'Кто и когда впервые стал покрывать кровлю листами?',
        'answers': [
            {
                'title': 'Русские строители в X веке',
                'correct': false
            },
            {
                'title': 'Первобытные люди каменного века',
                'correct': true
            },
            {
                'title': 'Древние строители из Месопотамии',
                'correct': false
            }
        ],
        'user_answer': false
    },
    {
        'id': 2,
        'title': 'Почему мягкая битумная черепица оказалась долговечнее пропитки из смолы?',
        'answers': [
            {
                'title': 'Она плотнее и толще',
                'correct': false
            },
            {
                'title': 'В нее добавили искуственный каучук',
                'correct': true
            },
            {
                'title': 'Благодаря посыпке из каменной крошки',
                'correct': false
            }
        ],
        'user_answer': false
    },
    {
        'id': 3,
        'title': 'Что из себя представляет битумная наплавляемая кровля?',
        'answers': [
            {
                'title': 'Пластины равных размеров',
                'correct': false
            },
            {
                'title': 'Рулоны кровельных и гидроизоляционных материалов',
                'correct': true
            },
            {
                'title': 'Горячий жидкий битум, который равномерно наносят на крышу',
                'correct': false
            }
        ],
        'user_answer': false
    },
    {
        'id': 4,
        'title': 'Самое распространенное кровельное покрытие сегодня?',
        'answers': [
            {
                'title': 'Битумно-полимерная мембрана',
                'correct': false
            },
            {
                'title': 'Микропористая мембрана',
                'correct': true
            },
            {
                'title': 'Полимерная мембрана',
                'correct': false
            }
        ],
        'user_answer': false
    }
];

var app = new Vue({
    el: '#test',
    data: {
        questions: questions,
        totalQuestion: 4,
        correctAnswers: 0,
        showResult: false,
        showError: false,
        testResult: 'bad',
        resultText: {
            'bad': {
                'text': 'Кровля – дело тонкое. Читайте наши статьи, слушайте подкасты и станете настоящим гуру!',
                'image': false
            },
            'good': {
                'text': 'Вы – молодец! Листайте сайт ниже. Там вы найдете еще много интересного о кровлях, включая подкасты',
                'image': 'images/test-silver.png'
            },
            'great': {
                'text': 'Вы – молодец! Листайте сайт ниже. Там вы найдете еще много интересного о кровлях, включая подкасты',
                'image': 'images/test-gold.png'
            }
        }
    },
    methods: {

        // Отображение позиции вопроса
        activePositin: function(n, id) {
            if(n == id) {
                return true;
            }
            else return false;
        },

        // Добавление ответа
        addAnswer: function(answer, item){
            questions[item].user_answer = answer;
        },

        // Проверка ответов
        checkAnswer: function(){

            let completed = true;

            // Проверим, ответили ли на все вопросы
            for(let i = 0; i < questions.length; i++) {

                let userAnswer = questions[i].user_answer;
                if(userAnswer === false) completed = false;

            }

            if(completed) {

                $('.js-modal-test').scrollTop(0);

                this.showError = false;
                this.showResult = true;

                let tempCorrectsAnswers = 0;

                for(let i = 0; i < questions.length; i++) {
                    let userAnswer = questions[i].user_answer;
                    if(questions[i].answers[userAnswer].correct == true) {
                        tempCorrectsAnswers++;
                    }
                }

                this.correctAnswers = tempCorrectsAnswers;

                let result = this.totalQuestion - tempCorrectsAnswers;

                if(result == 0) this.testResult = 'great';
                else if(result <= 2)  this.testResult = 'good';
                else this.testResult = 'bad';

            }
            else this.showError = true;
        },

        //определим, правильный ли ответ
        checkUserAnswer: function(answerKey, itemKey){

            let userAnswer = questions[itemKey].user_answer, // Ответ пользователя
                correctAnswer = 0; // Правильный ответ

            for(let i = 0; i < questions[itemKey].answers.length; i++) {
                if(questions[itemKey].answers[i].correct == true) correctAnswer = i;
            }

            if(answerKey == correctAnswer) {
                return {
                    'true': true
                };
            }
            else if(questions[itemKey].answers[userAnswer].correct == false && userAnswer == answerKey) {
                return {
                    'false': true
                };
            }
            else  return {
                'null': true
            };
        }

    }
});