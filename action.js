$(document).ready(function () {
  $.getJSON("http://localhost:5000/api/questions", function (data) {
    let score = 0;
    let data_question;

    $.each(data, function (index, value) {
      data_question = value;
    });

    // score
    function arraysEqual(_arr1, _arr2) {
      if (
        !Array.isArray(_arr1) ||
        !Array.isArray(_arr2) ||
        _arr1.length !== _arr2.length
      )
        score = 0;

      let arr1 = _arr1.concat().sort();
      let arr2 = _arr2.concat().sort();

      for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
          score = 0;
        } else {
          score += 1;
        }
      }
    }

    for (let i = 0; i < data_question.length; i++) {
      // check array
      arraysEqual(data_question[i].answers, data_question[i].answer_key);
    }

    for (let i = score; i < 5; i++) {
      $(".score").append(
        `
  <span class="pl-2" style="font-size: 20px;">
            <i class="fas fa-circle"></i>
          </span>
    `
      );
    }

    for (let i = 0; i < score; i++) {
      $(".score").append(
        `
  <span class="pl-2" style="font-size: 20px; color: yellow;">
            <i class="fas fa-smile"></i>
          </span>
    `
      );
    }
  });
  $.getJSON("http://localhost:5000/api/question", function (data) {
    let index;
    let data_question;
    let answer = [];
    $.each(data, function (index, value) {
      data_question = value;
    });

    // question & answer
    for (let i = 0; i < data_question.length; i++) {
      if (data_question[i].status === false) {
        index = i;
      } else {
        index = i + 1;
      }
      break;
    }

    $(".question").append(
      `
      ${data_question[index].question}
            `
    );

    $.each(data_question[index].choices, function (index, value) {
      $(".content").append(
        `
        <p
          class="answer${index} p-2 border border-primary btn-block rounded-pill"
        >
          ${value}
        </p>
        `
      );
    });

    for (let start = 0; start < data_question[index].choices.length; start++) {
      $(`.answer${start}`).on("click", function (e) {
        if (answer.indexOf($(this)[0].innerText) === -1) {
          $(this).removeClass("border-primary");
          $(this).addClass("border-secondary");
          answer.push($(this)[0].innerText);
        } else {
          $(this).removeClass("border-secondary");
          $(this).addClass("border-primary");
          let index = answer.indexOf($(this)[0].innerText);
          if (index !== -1) answer.splice(index, 1);
        }
        console.log(answer);
      });
    }

    $("button[name = 'submit']").on("click", function (e) {
      const data = { status: true, answers: answer };
      $.ajax({
        type: "PUT",
        url: `http://localhost:5000/api/question/${data_question[index]._id}`,
        contentType: "application/json",
        data: JSON.stringify(data),
      })
        .done(function (res) {
          window.location.reload();
        })
        .fail(function (msg) {
          console.log("FAIL");
        });
    });
  });
});
