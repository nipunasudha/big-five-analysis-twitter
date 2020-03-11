const EnumMode = {
    InputMode: 1,
    WaitingMode: 2,
    ResultsMode: 3
};

$(function () {
    // elements
    const $submit = $('#submitButton');
    const $reset = $('#resetButton');
    const $username = $('#username');
    // sections
    const $inputSection = $('#inputSection');
    const $waitingSection = $('#waitingSection');
    const $resultsSection = $('#resultsSection');
    // initialize
    switchMode(EnumMode.InputMode);
    // listen for button click
    $submit.on('click', function () {
        const username = $username.val();
        if (username.trim().length === 0) {
            alert('Twitter Username is Invalid. Please recheck!');
            return;
        }
        switchMode(EnumMode.WaitingMode);
        $.getJSON(`/api/getbigfive?username=${username}`, function (data) {
            console.log(data);
            switchMode(EnumMode.ResultsMode);
            setResults(data);
        });
    });
    // on reset
    $reset.on('click', function () {
        switchMode(EnumMode.InputMode);
        $username.val('');
    });

    // what to do when switching modes
    function switchMode(mode) {
        switch (mode) {
            case EnumMode.InputMode:
                $inputSection.show();
                $waitingSection.hide();
                $resultsSection.hide();
                break;
            case EnumMode.WaitingMode:
                $inputSection.hide();
                $waitingSection.show();
                $resultsSection.hide();
                break;
            case EnumMode.ResultsMode:
                $inputSection.hide();
                $waitingSection.hide();
                $resultsSection.show();
                break;
        }
    }

    function setResults(results) {
        const $rA = $('#rA');
        const $rC = $('#rC');
        const $rE = $('#rE');
        const $rN = $('#rN');
        const $rO = $('#rO');
        $rA.text(results['A']);
        $rC.text(results['C']);
        $rE.text(results['E']);
        $rN.text(results['N']);
        $rO.text(results['O']);
    }
});