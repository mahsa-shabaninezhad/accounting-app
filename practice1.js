let storage = []
let count = 50
let tableRowData = {
    id: 0,
    description: '',
    unit: '',
    number: 0,
    uPay: 0,
    discount: 0,
    tax: 0,
    tPay: 0
}
let isEdited = false
// let totalPay = 0

$('.btn-add').on("click", function () {
    $('.head-row').after(tableRow(count))
    count ++
})

$('table').on('click','.save',function (e){
    //Getting id due to making input of selected row readonly
    let id = clickedIconRow(this).attr('id')
    console.log($(`#${id} input[name='tax']`));
    if (isCellFull($(`#${id} input[name='tax']`))) {
        $(`#${id} input`).attr('readonly', true)
        $(`#${id} select`).attr('disabled', true)
        
        /*Puting inserted datas to 'tableRowData' object due to 
        saving datas for later changes*/
        captureNewAddedData(id)
        calcEveryRowTotalPayment()
        addOrReplaceData(id)
    
        // $(this).children().attr('href', './sprites.svg#icon-pencil')
        setTheEditMoodIcon(this)
    
        if(!isEdited){
            //setting the right row number
            $(`#${id} td:first-child`).html(storage.length)
    
            //Moving inserted item to the end of table
            clickedIconRow(this).appendTo('table')
        }
        
        editingMoodDisabled()
        updatingUiCalculations(id)
        
    }
} )

$('table').on('click','.undo',function (e){
    let id = clickedIconRow(this).attr('id')
    console.log('undo');
    restoreData(id)


} )

$('table').on('click','.edit',function (e){
    console.log('hello');
    let id = clickedIconRow(this).attr('id')
    editingMoodEnaibled(id)


    $(`#${id} input:not([name="tPay"])`).attr('readonly', false)
    $(`#${id} select`).attr('disabled', false)

    setTheSaveMoodIcon(this)
} )

$('table').on('click','.delete',function (e){
    let id = clickedIconRow(this).attr('id')
    console.log('delete');
    clickedIconRow(this).remove()
    deleteDataFromStorage(id)
    updatingUiCalculations()
} )


/*************************************FUNCTIONS***************************************/

function updatingUiCalculations(id) {
    console.log('iam runinig');
    $('.tax').html(`مالیات کل:${turnToRial(calcTotalTax())}`)
    $('.payment').html(`مبلغ کل:${turnToRial(calcTotalPayment())}`)
    $(`#${id} input[name='tPay']`).attr('type','text').val(turnToRial(tableRowData.tPay))
    $(`#${id} input[name='uPay']`).attr('type','text').val(turnToRial(tableRowData.uPay))
    $(`#${id} input[name='discount']`).attr('type','text').val(turnToRial(calculateDiscount()))
    $(`#${id} input[name='tax']`).attr('type','text').val(turnToRial(calcEveryRowTotalTax()))
}

function turnToRial(params) {
   params = params.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
   console.log(params);
   return `${params} ریال`

}

function calcEveryRowTotalPayment() {
    tableRowData.tPay = tableRowData.number * tableRowData.uPay - calculateDiscount() + calcEveryRowTotalTax()
    console.log(tableRowData.tPay);
}

function calculateDiscount() {
    const discount = tableRowData.number * tableRowData.uPay * tableRowData.discount / 100
    console.log('discount',discount, typeof discount);
    return discount
}

function calcEveryRowTotalTax() {
    const tax = tableRowData.number * tableRowData.tax
    console.log('tax',tax, typeof tax);
    return tax
}

function calcTotalPayment() {
    let totalPay = 0
    storage.forEach( data =>{
        totalPay += Number(data.tPay)
    })
    return totalPay
}
function calcTotalTax() {
    let totalTax = 0
    storage.forEach( data =>{
        totalTax += data.tax*data.number
    })
    return totalTax
}

function clickedIconRow(This){
    return $(This).parent().parent()
}


function inputValue(This){
    return $(This).val()
}

function inputNameAttr(This) {
    return $(This).attr('name')
}

function replaceExistingData(id) {    
    storage.forEach((data,index) => {
        if(data.id === id){
            storage[index] = {...tableRowData}
        }
    })
}

function captureNewAddedData(id) {
    tableRowData['id'] = id
    $(`#${id} input`).each(function(){
        tableRowData[inputNameAttr(this)] = inputValue(this)
    });
}

function checkExistenceOfData(id) {
    for (const obj of storage) {
        if(obj.id === id){
            return true
        }
    }
    return false
}

function addOrReplaceData(id) {
    checkExistenceOfData(id) ? replaceExistingData(id) : storage.push({...tableRowData})
}

function editingMoodEnaibled(id) {
    isEdited = true
    let backup = backupData(id)
    backup.tPay = 0

    for(let data in backup){
        console.log(backup,backup[data]);
        if(data === 'id'){
            continue;
        }else if(data !== 'description' || data !== 'unit'){
            $(`#${id} input[name=${data}]`).val(backup[data])
            console.log(data,backup[data]);
        }else{
            $(`#${id} input[name=${data}]`).attr('type','number').val(backup[data])
            
        }
    }
}
function editingMoodDisabled() {
    isEdited = false
}

//checking: is tax cell full or not
function isCellFull(cell) {
    if (cell.val() === '') {
        cell.parent().css('border-bottom', '1px solid red')
        return false
    }
    cell.parent().css('border-bottom', '1px solid #b1aeae')
    return true
}


function disableRow(id) {
    $(`#${id} input`).attr('readonly', false)
    $(`#${id} select`).attr('disabled', false)
}

function deleteDataFromStorage(id) {
    storage = storage.filter((data) => data.id !== id)
    console.log(storage);
}

function backupData(id) {
    for (const dataObj of storage) {
        if (dataObj.id === id) {
            return dataObj
        }
    }
}

function restoreData(id) {
    let backup = backupData(id)
    for(let data in backup){
        if(data !== 'id'){ //there is no input[name='id']
            $(`#${id} input[name=${data}]`).val(backup[data])
        }
    }
}


function setTheEditMoodIcon(This) {
    //Add edit icon insted of save icon
    $(This).children().attr('href', './sprites.svg#icon-pencil')
    //Change class of element to edit
    $(This).attr('class', 'edit')

    //Add delete icon insted of undo icon
    $(This).next().children().attr('href', './sprites.svg#icon-bin').css('color','red')
    //Change class of element to delete
    $(This).next().attr('class', 'delete')
}

function setTheSaveMoodIcon(This) {
    //Add edit icon insted of save icon
    $(This).children().attr('href', './sprites.svg#icon-floppy-o')
    //Change class of element to edit
    $(This).attr('class', 'save')

    //Add delete icon insted of undo icon
    $(This).next().children().attr('href', './sprites.svg#icon-undo').css('color','#2984eb')
    //Change class of element to delete
    $(This).next().attr('class', 'undo')
}

//functon for adding table row
function tableRow (count){
    return  `
    <tr id=row${count}>
    <td>#</td>
    <td>
        <select type="select" name="services">
            <option name="services" value="select ...">select ...</option>
            <option name="services" value="کالا"> کالا</option>
            <option name="services" value="خدمات"> خدمات</option>
        </select>
    </td>
    <td><input type="text" name="description"></td>
    <td><input type="text" name="unit"></td>
    <td><input type="number" name="number" min="0"></td>
    <td><input type="number" name="uPay" min="0"></td>
    <td><input type="number" name="discount" min="0" max="100"></td>
    <td><input type="number" name="tax" min="0"></td>
    <td><input type="number" name="tPay" value="0" readonly></td>
    <td class="btn-controls">
        <svg class="save">
            <use href='./sprites.svg#icon-floppy-o'/>
        </svg>
        <svg class="undo">
            <use href='./sprites.svg#icon-undo'/>
        </svg>
    </td>
</tr>`
}