function printContent() {
    var divContents = document.getElementById("terms").innerHTML;
    var a = window.open('', '', 'width=200, height=20vh ');
    a.document.write('<html>');
    a.document.write("<link rel=\"stylesheet\" href=\"css/style.css\" type=\"css/style.css\" media=\"print\"/>");
    a.document.write('<body >');
    a.document.write(divContents);
    a.document.write('</body></html>');
    a.document.close();
    a.focus();
    setTimeout(function () {
        a.print();
    }, 1000);
    // a.print();
}