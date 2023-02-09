/*Variáveis declaradas*/
const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sFuncao = document.querySelector('#m-funcao')
const sSalario = document.querySelector('#m-salario')
const btnSalvar = document.querySelector('#btnSalvar')

// let: Declara uma variável local no escopo do bloco atual, opcionalmente iniciando-a com um valor.
let itens
let id

/*Função criada para dar a ação necessária na modal (janela flutuante)*/
function openModal(edit = false, index = 0) {
   modal.classList.add('active')

   /*Essa parte da função, quando clicar fora da modal faz ela fechar */
   modal.onclick = e => {
      if (e.target.className.indexOf('modal-container') !== -1) {
         modal.classList.remove('active')
      }
   }

   /*
   Caso os campos sejam preenchidos("if"):
   os resultados dos campos são armazenados nas variáveis
   exemplo: 
   sNome.value -> valor da variável
   itens[index].nome -> resultado armazenado

   Caso não("else"):
   o campo recebe um valor vazio = ''
   */
   if (edit) {
      sNome.value = itens[index].nome
      sFuncao.value = itens[index].funcao
      sSalario.value = itens[index].salario
      id = index
   } else {
      sNome.value = ''
      sFuncao.value = ''
      sSalario.value = ''
   }

}

//recebe o Index pra saber qual item esta editando
function editItem(index) {

   openModal(true, index)
}

//recebe o Index pra saber qual item esta apagando
function deleteItem(index) {
   //splice: formatado usado pra remover ou adicionar itens do Array
   itens.splice(index, 1) // somente '1' item
   setItensBD()
   loadItens()
}

// cria um elemento 'tr' as colunas do container do cadastro
function insertItem(item, index) {
   let tr = document.createElement('tr')

   tr.innerHTML = `
      <td>${item.nome}</td>
      <td>${item.funcao}</td>
      <td>R$ ${item.salario}</td>
      <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
      </td>
      <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
      </td>
   `
   tbody.appendChild(tr) // faz cada item aparecer um embaixo do outro
}


btnSalvar.onclick = e => {

   if (sNome.value == '' || sFuncao.value == '' || sSalario.value == '') {
      return
   } //ao clicaar retorna variáveis vazias

   //e = evento
   e.preventDefault();

   //indica que se os itens forem alterados, receberam novos Id's
   if (id !== undefined) {
      itens[id].nome = sNome.value
      itens[id].funcao = sFuncao.value
      itens[id].salario = sSalario.value
   }
   // caso não forem alterados, será efetuado o 'push' e assim os itens permanecerão o mesmo
   else {
      itens.push({ 'nome': sNome.value, 'funcao': sFuncao.value, 'salario': sSalario.value })
   }

   setItensBD() //atualiza o banco de Dados

   //indica que a classe 'active' ficará invisível para gente ao clicar em "Salvar", ou seja, voltará para o evento acima, permanecendo os mesmos itens, caso não sejam alterados.
   modal.classList.remove('active')
   loadItens()
   id = undefined
}

//funcao que carregará os dados recebidos
function loadItens() {
   itens = getItensBD() //recebe os dados armazenados
   tbody.innerHTML = '' //por padrão os dados são 'nulos'
   //sistema de repetição para cada item 
   itens.forEach((item, index) => {
      insertItem(item, index)
   })

}

//essa variável retornará um valor "branco" caso não tenha um valor de retorno no banco de dados. 
//esse banco de dados é criado em uma estrutura JSON.
const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []
const setItensBD = () => localStorage.setItem('dbfucn', JSON.stringify(itens))
//grava os itens adicionados no banco local (dbfunc) em uma estrutura JSON

loadItens()
//carrega todos os Itens