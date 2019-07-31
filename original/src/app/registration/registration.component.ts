import {Component, Inject, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {Presenter} from "../model/presenter.model";
import {PresenterService} from "../services/presenter.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SecurityService} from "../services/security.service";
import {DOCUMENT} from "@angular/common";

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
    registrationForm: FormGroup;
    //хардкод
    presenter: Presenter = {
        initials: '',
        department: '',
        position: '',
        username: '',
        password: '',
    };
    recovery: boolean;

    constructor(private readonly fb: FormBuilder, private readonly presenterService: PresenterService,
                private readonly router: Router, private readonly security: SecurityService,
                private readonly route: ActivatedRoute, @Inject(DOCUMENT) private readonly document: Document) {
        this.document.getElementById("rosatom-header").style.minWidth = '200px';
    }

    initRegistrationForm(presenterByRecovery: Presenter) {
        const pwdValidators: ValidatorFn[] = [Validators.required, Validators.minLength(8), Validators.maxLength(20)];

        let login: string;
        if (presenterByRecovery) {
            login = presenterByRecovery.username;
            this.recovery = true;

            this.registrationForm = this.fb.group({
                login: [login, [Validators.required, this.userNameValidator()]],
                passwords: this.fb.group({
                    pwd: ['', pwdValidators],
                    pwdconfirm: ['', pwdValidators]
                }, {
                    validator: this.passwordsAreEqual()
                }),
                server: ['']
            });

        } else {
            login = '';
            this.recovery = false;

            this.registrationForm = this.fb.group({
                login: [login, [Validators.required, this.userNameValidator()]],
                passwords: this.fb.group({
                    pwd: ['', pwdValidators],
                    pwdconfirm: ['', pwdValidators]
                }, {
                    validator: this.passwordsAreEqual()
                }),
                confirm1: ['', [this.checkCheckbox('confirm1')]],
                confirm2: ['', [this.checkCheckbox('confirm2')]],
                server: ['']
            });
        }

        this.registrationForm.statusChanges.subscribe((status) => {
            if (status === 'INVALID' && !!this.presenter) {
                //хардкод
                this.presenter = {
                    initials: '',
                    department: '',
                    position: '',
                    username: '',
                    password: '',
                };
            }
        });
    }

    inputLogin() {
        this.registrationForm.controls['server'].setErrors(null);
    }

    private userNameValidator(): ValidatorFn {
        //const pattern: RegExp = /^[-._A-Za-z0-9]+@(?:[A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,6}$/;
        const pattern: RegExp = /^[-._A-Za-z0-9]+@([-_A-Za-z0-9]*\.)?(acc.bz|acti.ru|adviks.ru|aecc.ru|aem-group.ru|aem-leasing.ru|aemtech.eu|aemtech.ru|aep.ru|akkunpp.com|akkuyu.com|akti.ru|alstom-aem.com|aogspi.ru|aoopit.ru|ao-te.ru|apsbt.ru|arako.cz|arako.spb.ru|armz.ru|armz-service.ru|aromstroyexport.ru|ase-ec.ru|ase-engin.ru|aspol.ru|asup.ecp.ru|atc1.vrn.ru|atech.ru|ateszori.ru|atex.org.ru|atomarhiv.ru|atomcapital.ru|atomenergoprom.ru|atomfond.ru|atominvest.com|atomkomplekt.org|atomleasing.ru|atomlink.ru|atommash.ru|atomproekt.com|atomprof.spb.ru|atomrus.ru|atomsafety.ru|atomsbt.ru|atom-service.ru|atomsib.ru|atomsp.ru|atomsro.ru|atomst.ru|atomstandart.ru|atomstroyexport.ru|atomtes.ru|atom-tm.ru|atomtrans.ru|atomts.ru|atoproekt.com|atos.net|atsbt.ru|balakovo.info|balatech.ru|balnpp.ru|balnps.ru|baltaes.ru|bcsoft.com|bdo.ru|bearingpoint.com|bearingpointconsulting.com|belnpp.ru|belnpp2.ru|bim-info.com|bim-info.ru|bochvar.ru|bray.com|btaes.ru|btas.ru|cate.ru|catom.ru|cc.nifhi.ac.ru|centratom.ru|centrotech.ru|chmz.ru|chukotnet.ru|cipk.obninsk.ru|ckbm.net|ckbm.ru|cniitmash.ru|compcenter.org|compcentr.org|compozit.su|condi.by|constructor.ru|consyst-oc.zori.ru|c-plus.pro|croc.ru|cufs.ru|dalur.ru|dedal.ru|dilnpp.ru|dim.fcnrs.ru|dit.ru|dnc.ru|dnrc.ru|do.ueip.ru|dol.ru|domatom.ru|dubna.ru|eapr.ru|eato.ru|eatom.ru|eco-nu.ru|ecp.kts.ru|ecp.ru|ecrgc.ru|eenv.nl|eiz-spb.ru|elektrostal.ru|elemash.ru|elemash-stp.ru|elemer.ru|eleron.ru|emss.dn.ua|enegy-c.ru|energy.sarov.ru|energyanalytica.ru|energy-c.ru|energy-r.ru|ens.ru|ensm.ru|epam.com|eph-atom.ru|erec.ru|esc.ecp.ru|ese-ec.ru|esk-armz.ru|etel.ru|fbk.ru|fcnrs.ru|fenrs.ru|fin.sialuch.ru|firepro.ru|fpmcenter.ru|front.ru|gosstart.ru|greenatom.ru|group-gem.ru|gspi-minatom.ru|hccomposite.com|hiagda.rru|iaes.ru|ibs.ru|iftp.ru|ihep.ru|imf.ru|inbox.ru|incon.ru|ind-park.ru|infotex-line.ru|inlinegroup.ru|inlinegroup-c.ru|ins.nccp.ru|intelenergomash.ru|inter.atex.org.ru|interef.ru|inteteref.ru|ippe.ru|irm.ru|irmatom.ru|isop.ecp.ru|isotop.ru|iss-atom.ru|istok.sialuch.ru|itd.niiefa.spb.su|itep.ru|iterrf.ru|iuec.ru|izotop.ru|izotop-ekb.ru|jv-uec.ru|kaes-s.ru|kaesservice.ru|kaes-service.zori.ru|kaluga.ru|karpovic.ru|karpovipc.ru|kbato.ru|kc-tvel.ru|khlopin.ru|khmz.ru|khpe.ru|kit.niiefa.spb.su|klnate.ru|klopin.ru|kmz.net|kmz.ru|kmz-avto.kvmz.ru|knnp.ru|knpp.ru|knpp-auto.ru|koatom.murmansk.ru|kokaer.ru|kolaer.ru|kolatom.murmansk.ru|kolatom.murmaysk.ru|kolatomavto.ru|kolatom-avto.zori.ru|kras.oaogspi.ru|kras.oaogspsi.ru|krown-service.ru|kru.ecm.ru|ks-tvel.ru|ku.ueip.ru|kunpp.ru|kvmz.ru|laes.ru|laes.sbor.ru|laes2.ru|laes-avto.ru|lenaes.ru|live.com|lkt.niiefa.spb.su|lnpp.ru|lnpp2.ru|lotus.skc.ru|ltt.niiefa.spb.su|luch.podolsk.ru|luch-protvino.ru|luts.niiefa.spb.su|mars-mokb.ru|mayak.ru|mbp.ru|mcc.krasnovarsk.su|mcc.krasnoyarsk.ru|mcc.krasnoyarsk.su|me.com|mepq.ru|mipkae.ru|mit.niiefa.spb.su|mk-chmz.net|mokb-mars.ru|molniya.ru|mpre.ru|msk.nwatom.ru|msk.titan2.ru|myarttit.ru|mzp.ru|nacec.ru|naelco.ru|nanopolimer.ru|narod.ru|nccp.ru|nccp-energy.ru|nccp-eng.ru|ncpp.ru|ndtexpert.ru|neep.ru|neolant.ru|netgts.ru|ngs.ru|ngss-ltd.ru|niaep.ru|niaept.ru|niaes.ru|nifhi.ru|niiar.ru|niiefa.spb.ru|niigrafit.org|niigrafit.ru|niiis.nnov.ru|niipribor.ru|niis.nnov.ru|niitfa.ru|niitfa.spb.su|nikiet.ru|nikiret.ru|niti.ru|norao.ru|novawind.ru|novenergoprom.ru|novomoloko.ru|novozep.ru|npc-elegia.ru|npf-atom.ru|npp.bil|nppinject.ru|npz.ru|nrdc.ru|ntcatech.ru|nuclear-safety.com|nukemtechnologies.de|null|nvaes-2.ru|nvass.ru|nvate.ru|nvate.vrn.ru|nvnpp.vrn.ru|nvnpp1.rosentrgoatom.ru|nvutc.rosatomtech.ru|nwatom.ru|nzhk-instrument.ru|oaoata.ru|oaogspi.ru|oaokmz.ru|oao-otek.ru|oao-sus.ru|oaozio.msk.ru|obninsk.ru|oirt.sniip.ru|okb.nnov.ru|okbm.nnov.ru|okbm.ru|okhtz.ru|okp.ueip.ru|ok-rsk.ru|oksat.nikiet.ru|oktbis.com|ooouat.ru|orb.niiar.ru|orb.ru|orip.niiar.ru|outbound01.rosatom.ru|ozersk.com|ozersk.ru|oztmts.ru|pbm.onego.ru|pik-elbi.ru|pkf-vniiaes.ru|pmc.ru|pmexpert.ru|pmsoft.ru|po-mayak.ru|posever.ru|ppgho.ru|ppho.ru|ppqho.ru|prehghk.ru|prepreg-acm.com|pribor-serv.ru|procervic.ru|prominn.ru|proryv2020.ru|protvino.net|ps-rosatom.ru|pub.niiar.ru|pzm.ru|pzm.su|radon.ru|rambler.ru|ras-group.ru|rasu.ru|rb-armz.ru|rbate.ru|rbm.armz.ru|redstaratom.ru|remis.ecp.ru|remont.vniiaes.ru|remus.ecp.ru|renet.ru|roate.ru|rosatom.ru|rosatom-academy.org|rosatom-cipk.ru|rosatomflot.ru|rosatominternational.com|rosatomtec.ru|rosatomtech.ru|rosatomtech.spb.ru|rosenergoatom.ru|rosnpp.org.ru|rosrao.org|rosrao.ru|rostovnpp.ru|rotex24.ru|rr-energy.ru|rusatomhc.ru|rusatomservice.ru|rus-carbon.ru|rusenergomir.ru|ruskor.ru|rw-t.ru|saes.ru|saes-service.ru|sap.com|saprun.com|sar.ru|sarbazalt.ru|sb.ueip.ru|scicet.ru|seversk.tomsknet.ru|shk.ru|sialuch.ru|sibcon-soft.ru|sibintek.ru|sibmail.ru|sibosp.ru|sibregionprom.ru|sintez.niiefa.spb.su|skc.niiar.ru|skc.ru|smate.org|smberkut.ru|smolate.ru|smrp-ghk.ru|smteam.grpress.podolsk.ru|smu-n1.ru|smutc.ru|sniihim.ru|sniip.ru|snpp.ru|snvsar.ru|snz.ru|spbaep.ru|spu24.ru|startatom.ru|startatoom.ru|stepel.ru|sts-rus.ru|svbr.org|sxk.ru|technopark-technology.ru|tenex.ru|tenex-logistics.ru|tenzor.net|titan2.ru|tnp.remis.ecp.ru|tomsk.atomrus.ru|transatom.ru|trans-s.com|trest-rossem.ru|triniti.ru|tvel.ru|tvelinvest.ru|tvel-it.ru|tvel-stroy.ru|u1g.ru|u1holding.com|uattrans.ru|udm.net|udmnet.ru|ueip.ru|uemz.ru|ufamts.ru|ugl.ru|uicorp.ru|ukr.net|uks.vniieef.ru|ulg.ru|umatex.com|umatex.ru|umcompany.ru|umpk.ru|unicorp.ru|ural.ru|uralaer.ru|uralpribor.com|usis.sar.ru|usn-projects.ru|vast.vrn.ru|vconvers.sar.ru|vdvniiam.ru|vei.ru|venta-nt.ru|venta-nt.u|vetroogk.ru|veza-spb.ru|vkmz.ru|vniia.com|vniia.net|vniia.ru|vniiaes.ru|vniiaes-asutp.ru|vniiam.ru|vniief.ru|vniiht.ru|vniitf.ru|vnipiet-nsk.ru|vnipipt.ru|vnpp-service.ru|vpotochmash.ru|vtomske.ru|yafi.ru|yemz.ru|zaes.ru|zao-pko.ru|zel-iskra.ru)$/;

        return (control: AbstractControl): { [key: string]: any } => {
            if (!(control.dirty || control.touched)) {
                return null;
            } else {
                return pattern.test(control.value) ?
                    // null : {custom: `В формате email, минимум 5 символов: латиница, цифры, символы "@" и "."`};
                     null : {custom: `Такого домена нет в списке разрешенных. Обратитесь на 1111@greenatom.ru`};
            }
        };
    }

    public submitForm(e: Event) {
        e.preventDefault();

        if (this.registrationForm.invalid) {
            this.markControlsAsTouched(this.registrationForm);

            return;
        }

        this.presenter.username = this.registrationForm.value.login.toLowerCase();
        this.presenter.password = this.registrationForm.value.passwords.pwd;

        if (!this.recovery) {
            this.presenterService.add(this.presenter).subscribe(() => {
                    this.security.login(this.presenter.username, this.presenter.password, this.registrationForm);
                },
                error => {
                    this.registrationForm.controls['server'].setErrors({'error': error.error});
                    this.registrationForm.controls['server'].markAsTouched();
                });

        } else {
            if (this.route.queryParams['value'].recovery) {
                this.presenterService.resetPassword(this.presenter, this.route.queryParams['value'].recovery)
                    .subscribe(() => {
                        this.security.login(this.presenter.username, this.presenter.password, this.registrationForm);
                    });
            }
        }
    }

    private markControlsAsTouched(form) {
        for (const control of form.controls) {
            control.markAsTouched();

            if (control.controls) {
                this.markControlsAsTouched(control);
            }
        }
    }

    private checkCheckbox(nameCheck): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (control.value === false) {
                if (nameCheck === 'confirm1') {
                    return {custom: `Требуется согласие на обработку персональных данных`};
                }

                return {custom: `Требуется подтверждение корректности данных`};
            } else {
                return null;
            }
        }
    }

    ngOnInit() {
        this.route.data.subscribe(data => {
            const presenterByRecovery: Presenter = data.presenterByRecovery;
            this.initRegistrationForm(presenterByRecovery);
        });
    }

    public cancel() {
        this.router.navigate(["/login"]);
    }

    private passwordsAreEqual(): ValidatorFn {
        return (group: FormGroup): { [key: string]: any } => {
            if (!(group.dirty || group.touched) || group.get('pwd').value === group.get('pwdconfirm').value) {
                return null;
            }

            return {
                custom: 'Пароли не совпадают'
            };
        };
    }
}
